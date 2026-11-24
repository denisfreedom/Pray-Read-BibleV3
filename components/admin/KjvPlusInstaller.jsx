import React, { useCallback, useEffect, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { getAdminToken } from "@/lib/adminSession";
import {
  BookOpenIcon,
  CheckIcon,
  DownloadIcon,
  Loader2Icon,
  RefreshCwIcon,
  SparklesIcon,
  WrenchIcon
} from "lucide-react";
import ChapterCoverage from "@/components/admin/ChapterCoverage";

/**
 * Installs the King James Version with the Strong's numbers.
 *
 * The installer takes every chapter from the public KJV source that marks
 * each Greek and Hebrew word with its Strong's number, and keeps it in the
 * app, so a reader can open any chapter with the numbers marked, online or
 * offline, and without needing a signed-in session.
 *
 * The same panel prepares the dictionary: every Strong's number of the Bible
 * is looked up once and kept in the app, so every blue number opens its
 * meaning straight away, from Genesis to Revelation.
 */
export default function KjvPlusInstaller() {
  const [status, setStatus] = useState(null);
  const [dictionary, setDictionary] = useState(null);
  const [busy, setBusy] = useState(false);
  const [wordBusy, setWordBusy] = useState(false);
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("success");
  const [wordNote, setWordNote] = useState("");
  const [wordTone, setWordTone] = useState("success");

  const call = useCallback(async (action, payload = {}) => {
    const response = await fse2.functions.invoke("kjvInstall", {
      action,
      token: getAdminToken(),
      ...payload
    });
    const data = response && response.data ? response.data : response;
    if (!data || data.error) {
      throw new Error((data && data.error) || "The installer could not answer.");
    }
    if (data.status === 401 || data.installed === undefined) {
      throw new Error("Your admin session expired. Sign in again.");
    }
    return data;
  }, []);

  const callWords = useCallback(async (action, payload = {}) => {
    const response = await fse2.functions.invoke("strongsDefinition", { action, ...payload });
    const data = response && response.data ? response.data : response;
    if (!data || data.error) {
      throw new Error((data && data.error) || "The dictionary could not answer.");
    }
    if (data.status === 401 || data.total === undefined) {
      throw new Error("Your admin session expired. Sign in again.");
    }
    return data;
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data = await call("status");
      setStatus(data);
      setNote("");
      setTone("success");
    } catch (error) {
      setTone("error");
      setNote(error.message || "Could not read the install status.");
    }
    try {
      const words = await callWords("status");
      setDictionary(words);
    } catch {
      // The dictionary report is a comfort: the install still works without it.
    }
  }, [call, callWords]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const install = async (whole) => {
    setBusy(true);
    setNote("");
    setTone("success");
    try {
      if (!whole) {
        const data = await call("install", { limit: 20 });
        setStatus(data);
        if (data.errors && data.errors.length) {
          setTone("error");
          setNote(
            `${data.errors.length} chapters could not be read yet: ${data.errors.slice(0, 3).join(" · ")}`
          );
        } else {
          setNote(`${data.added} chapters were added. ${data.missing} chapters are still missing.`);
        }
        return;
      }

      let data = null;
      for (let round = 0; round < 60; round += 1) {
        data = await call("install", { limit: 60 });
        setStatus(data);
        if (data.done) {
          setTone("success");
          setNote(
            `The KJV+ Bible is installed: all ${data.total} chapters are in the app, with their Strong's numbers.`
          );
          return;
        }
        if (!data.added) {
          setTone("error");
          setNote(
            `The installer stopped. ${data.missing} chapters are still missing${
              data.errors && data.errors.length ? `: ${data.errors.slice(0, 3).join(" · ")}` : "."
            }`
          );
          return;
        }
        setNote(`Installing… ${data.ready} of ${data.total} chapters are ready.`);
      }
      setTone("error");
      setNote("The installer is still running. Press the button again to carry on where it stopped.");
    } catch (error) {
      setTone("error");
      setNote(error.message || "The installer stopped.");
    } finally {
      setBusy(false);
    }
  };

  const repair = async () => {
    setBusy(true);
    setNote("");
    setTone("success");
    try {
      const data = await call("repair", { limit: 60 });
      setStatus(data);
      if (data.repaired) {
        setNote(`${data.repaired} chapters were downloaded again. ${data.missing} chapters are still missing.`);
      } else {
        setNote("There was nothing to repair.");
      }
    } catch (error) {
      setTone("error");
      setNote(error.message || "The repair stopped.");
    } finally {
      setBusy(false);
    }
  };

  const prepareWords = async () => {
    setWordBusy(true);
    setWordNote("");
    setWordTone("success");
    try {
      let data = null;
      for (let round = 0; round < 40; round += 1) {
        data = await callWords("prepare", { limit: 800 });
        const cached = Number(data.cached || 0) + Number(data.prepared || 0);
        const total = Number(data.total || 0);
        setDictionary((current) => ({
          ...(current || {}),
          total,
          cached,
          missing: Number(data.remaining || 0),
          languages: data.languages || (current && current.languages) || {}
        }));
        if (data.done || !data.prepared) {
          if (data.remaining) {
            setWordTone("error");
            setWordNote(`${data.remaining} words could not be kept yet. Press the button again to carry on.`);
          } else {
            setWordTone("success");
            setNote(
              `Every Strong's number of the Bible is ready: ${total} words, from Genesis to Revelation.`
            );
            setWordNote(
              `Every Strong's number of the Bible is ready: ${total} words, from Genesis to Revelation.`
            );
          }
          return;
        }
        setWordNote(`Looking the words up… ${cached} of ${total} words are ready.`);
      }
      setWordTone("error");
      setWordNote("The lookup is still running. Press the button again to carry on where it stopped.");
    } catch (error) {
      setWordTone("error");
      setWordNote(error.message || "The lookup stopped.");
    } finally {
      setWordBusy(false);
    }
  };

  const installed = Number(status?.installed || 0);
  const ready = Number(status?.ready || 0);
  const missing = Number(status?.missing || 0);
  const broken = Number(status?.broken || 0);
  const total = Number(status?.total || 0);
  const percent = total ? Math.min(100, Math.round((ready / total) * 100)) : 0;

  const wordsTotal = Number(dictionary?.total || 0);
  const wordsCached = Number(dictionary?.cached || 0);
  const wordsPercent = wordsTotal ? Math.min(100, Math.round((wordsCached / wordsTotal) * 100)) : 0;

  return (
    <div className="pr-grid pr-grid-2">
      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
          <BookOpenIcon className="h-4 w-4" style={{ display: "inline" }} /> Install the KJV+ with the Strong&apos;s
          numbers
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
          The installer copies every chapter of the King James Version, with the Greek and Hebrew word marked by
          its Strong&apos;s number, into the app. Every chapter is checked, so a chapter without a single number
          is never counted as installed.
        </p>

        <div style={{ height: 8, borderRadius: 999, background: "var(--pr-border)", overflow: "hidden" }}>
          <div
            style={{ width: `${percent}%`, height: "100%", background: "var(--pr-emerald)", transition: "width 240ms ease" }}
          />
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "var(--pr-body)" }}>
          {ready} of {total} chapters are ready ({percent}%)
          {missing ? ` · ${missing} still missing` : ""}
          {broken ? ` · ${broken} to repair` : ""}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button
            type="button"
            className="pr-btn pr-btn-primary pr-btn-sm"
            onClick={() => install(true)}
            disabled={busy}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            Install every missing chapter
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={() => install(false)}
            disabled={busy}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            Install the next 20
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={repair}
            disabled={busy}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <WrenchIcon className="h-4 w-4" />}
            Repair the chapters
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={loadStatus} disabled={busy}>
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <RefreshCwIcon className="h-4 w-4" />}
            Verify
          </button>
        </div>

        {note ? (
          <div className={tone === "error" ? "pr-error" : "pr-success"} style={{ marginTop: 14 }}>
            {note}
          </div>
        ) : null}

        {status && status.books ? (
          <ChapterCoverage books={status.books} missing={missing} broken={broken} />
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        <div className="pr-card pr-card-pad">
          <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
            <SparklesIcon className="h-4 w-4" style={{ display: "inline" }} /> Prepare the Strong&apos;s dictionary
          </h2>
          <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
            The meaning of every Greek and Hebrew word of the Bible is looked up once and kept in the app, so
            every blue number opens its definition in a soft card, from Genesis to Revelation.
          </p>

          <div style={{ height: 8, borderRadius: 999, background: "var(--pr-border)", overflow: "hidden" }}>
            <div
              style={{ width: `${wordsPercent}%`, height: "100%", background: "var(--pr-gold-btn)", transition: "width 240ms ease" }}
            />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "var(--pr-body)" }}>
            {wordsCached} of {wordsTotal} words are ready ({wordsPercent}%)
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button
              type="button"
              className="pr-btn pr-btn-primary pr-btn-sm"
              onClick={prepareWords}
              disabled={wordBusy}
            >
              {wordBusy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}
              Look the words up
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={loadStatus}
              disabled={busy || wordBusy}
            >
              <RefreshCwIcon className="h-4 w-4" />
              Verify
            </button>
          </div>

          {wordNote ? (
            <div className={wordTone === "error" ? "pr-error" : "pr-success"} style={{ marginTop: 14 }}>
              {wordNote}
            </div>
          ) : null}

          {dictionary && dictionary.languages ? (
            <ul className="pr-list-reset" style={{ display: "grid", gap: 6, marginTop: 14, fontSize: "0.83rem" }}>
              {Object.keys(dictionary.languages).map((language) => (
                <li key={language} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <CheckIcon className="h-4 w-4" style={{ color: "var(--pr-emerald)" }} />
                  {language}: {dictionary.languages[language].cached} of {dictionary.languages[language].total} words
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="pr-card pr-card-pad">
          <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
            How the reader gets the Strong&apos;s numbers
          </h2>
          <ul className="pr-list-reset" style={{ display: "grid", gap: 10, fontSize: "0.85rem" }}>
            <li>
              <strong>Every blue number opens its definition</strong>, in a soft card that shows the word in
              its original language, how it is pronounced and what it means.
            </li>
            <li>
              <strong>The definition is kept in the app</strong>, so the word opens straight away, even
              without a connection.
            </li>
            <li>
              <strong>The live lexicon stays the safety net</strong> for a word that has not been looked up
              yet.
            </li>
            <li>
              <strong>The install can be left to the background</strong>: the automation of the app keeps
              filling what is missing, and the button above picks up where it stopped.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}