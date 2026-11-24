import React, { useEffect, useState } from "react";
import { BookOpenIcon, ExternalLinkIcon, Loader2Icon, XIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";
import { normalizeStrongCode, strongLanguage, strongLexiconUrl } from "@/lib/strongs";
import { readOfflineStrong, writeOfflineStrong } from "@/lib/strongsOffline";

/**
 * Keeps a copy of a definition in the app.
 * Only the administrator can write, so a reader simply carries on.
 */
const storeEntry = async (values) => {
  try {
    const rows = await fse2.entities.StrongEntry.filter({ code: values.code });
    if (rows && rows.length) {
      await fse2.entities.StrongEntry.update(rows[0].id, values);
      return;
    }
    await fse2.entities.StrongEntry.create({
      code: values.code,
      language: values.language || "",
      original_word: values.original_word || "",
      transliteration: values.transliteration || "",
      pronunciation: values.pronunciation || "",
      part_of_speech: values.part_of_speech || "",
      root_word: values.root_word || "",
      definition: values.definition || "",
      source: values.source || "Blue Letter Bible"
    });
  } catch {
    /* the copy is a comfort, not a requirement */
  }
};

/**
 * The definition of a Strong's number.
 *
 * Tapping a blue Strong's number opens this soft card: the word in its
 * original language, how it is pronounced and what it means. The answer is
 * read from the copy the app keeps, and is looked up once when it is not
 * there yet, so the next reader of the same word gets it straight away.
 */
export default function StrongsPopup({ code, word = "", onClose }) {
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!code) return undefined;
    const key = normalizeStrongCode(code);
    if (!key) {
      setStatus("error");
      return undefined;
    }
    let cancelled = false;
    setEntry(null);
    setStatus("loading");

    const show = (data) => {
      if (cancelled) return;
      if (!data || data.error || !data.definition) return false;
      setEntry({ ...data, code: key });
      setStatus("ready");
      return true;
    };

    // The copy on the device comes first: it is there at once, and it is
    // the one that works when there is no connection.
    const readDevice = async () => {
      const row = await readOfflineStrong(key);
      if (row && row.definition) {
        show(row);
        return row;
      }
      return null;
    };

    // Then the copy the app keeps: it is there in a moment.
    const readCache = async () => {
      try {
        const rows = await fse2.entities.StrongEntry.filter({ code: key });
        const row = (rows || [])[0];
        if (row && row.definition) {
          show(row);
          writeOfflineStrong(row);
          return row;
        }
      } catch {
        /* the copy is a comfort, not a requirement */
      }
      return null;
    };

    // Then the live lexicon, for a word that is not kept yet.
    const readLive = async () => {
      try {
        const response = await fse2.functions.invoke("strongsDefinition", { code: key });
        const data = response && response.data ? response.data : response;
        if (show(data)) {
          // The administrator keeps a copy of every word they open, so the
          // next reader gets the answer straight away.
          storeEntry(data);
          // The word is kept on the device as well, so the card opens even
          // when the reader is out of reach.
          writeOfflineStrong({ ...data, code: key });
          return;
        }
        const cached = await readCache();
        if (!cached && !cancelled) setStatus("error");
      } catch {
        const cached = await readCache();
        if (!cached && !cancelled) setStatus("error");
      }
    };

    const start = async () => {
      const onDevice = await readDevice();
      if (onDevice || cancelled) return;
      const cached = await readCache();
      if (cached || cancelled) return;
      await readLive();
    };
    start();

    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!code) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [code, onClose]);

  if (!code) return null;

  const key = normalizeStrongCode(code) || String(code);
  const lexiconUrl = strongLexiconUrl(key);

  return (
    <div className="pr-strongs-backdrop" onClick={onClose} role="presentation">
      <div
        className="pr-strongs-popup"
        role="dialog"
        aria-modal="true"
        aria-label={`Strong's ${key}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pr-strongs-popup-head">
          <span className="pr-strongs-popup-code" translate="no">
            {key}
          </span>
          <span className="pr-strongs-popup-kind">
            {entry && entry.language ? entry.language : strongLanguage(key)}
          </span>
          <button
            type="button"
            className="pr-strongs-popup-close"
            onClick={onClose}
            aria-label="Close the definition"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="pr-strongs-popup-body">
          {status === "loading" ? (
            <div className="pr-strongs-popup-loading">
              <Loader2Icon className="h-5 w-5 animate-spin" />
              <span>Looking up Strong&apos;s {key}…</span>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="pr-strongs-popup-error">
              <p style={{ margin: "0 0 10px" }}>
                The definition of Strong&apos;s {key} could not be reached just now. The word is still marked
                in the text, and the full lexicon is one tap away.
              </p>
              <a className="pr-btn pr-btn-outline pr-btn-sm" href={lexiconUrl} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className="h-4 w-4" /> Open the full lexicon
              </a>
            </div>
          ) : null}

          {status === "ready" && entry ? (
            <>
              {entry.original_word ? (
                <p className="pr-strongs-popup-word" lang={key.startsWith("G") ? "grc" : "hbo"}>
                  {entry.original_word}
                </p>
              ) : null}

              {entry.transliteration || entry.pronunciation ? (
                <p className="pr-strongs-popup-sound">
                  {entry.transliteration ? <em>{entry.transliteration}</em> : null}
                  {entry.transliteration && entry.pronunciation ? " · " : null}
                  {entry.pronunciation ? <span>{entry.pronunciation}</span> : null}
                </p>
              ) : null}

              {entry.part_of_speech ? (
                <span className="pr-strongs-popup-tag">{entry.part_of_speech}</span>
              ) : null}

              {entry.definition ? (
                <p className="pr-strongs-popup-definition">{entry.definition}</p>
              ) : null}

              {entry.root_word ? (
                <p className="pr-strongs-popup-root">
                  <BookOpenIcon className="h-4 w-4" style={{ display: "inline" }} /> {entry.root_word}
                </p>
              ) : null}

              {word ? (
                <p className="pr-strongs-popup-verse">
                  In this verse the word reads <strong>{word}</strong>.
                </p>
              ) : null}

              <p className="pr-strongs-popup-source">
                {entry.source || "Blue Letter Bible"}{" "}
                <a href={lexiconUrl} target="_blank" rel="noreferrer">
                  Read the full entry <ExternalLinkIcon className="h-3 w-3" style={{ display: "inline" }} />
                </a>
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}