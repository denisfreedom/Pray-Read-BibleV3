import React, { useCallback, useEffect, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { getAdminToken } from "@/lib/adminSession";
import { BookOpenIcon, DownloadIcon, Loader2Icon, SparklesIcon } from "lucide-react";

/**
 * Installs the King James Version with the Strong's numbers.
 *
 * The installer takes every chapter from the public KJV source that marks
 * each Greek and Hebrew word with its Strong's number, and keeps it in the
 * app, so a reader can open any chapter with the numbers marked, online or
 * offline, and without needing a signed-in session.
 *
 * The same panel prepares the dictionary: the definition of the words that
 * are read most often is looked up once and kept in the app, so every
 * reader opens them straight away.
 */
export default function KjvPlusInstaller() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("success");
  const [lexicon, setLexicon] = useState(null);
  const [lexiconBusy, setLexiconBusy] = useState(false);

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
    return data;
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data = await call("status");
      setStatus(data);
      const rows = await fse2.entities.StrongEntry.list("-updated_date", 1000);
      setLexicon({ prepared: (rows || []).length });
    } catch (error) {
      setTone("error");
      setNote(error.message || "Could not read the install status.");
    }
  }, [call]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const install = async (whole) => {
    setBusy(true);
    setNote("");
    try {
      let data = null;
      let start = 0;
      for (let round = 0; round < 90; round += 1) {
        data = whole
          ? await call("install", { limit: 40, start, refresh: true })
          : await call("install", { limit: 20 });
        setStatus({ installed: data.stored, total: data.total });
        if (data.errors && data.errors.length) {
          setTone("error");
          setNote(
            `${data.errors.length} chapters could not be read yet: ${data.errors.slice(0, 3).join(" · ")}`
          );
        }
        if (!whole) break;
        start = Number(data.next || start + 20);
        if (start >= Number(data.total || 0)) break;
      }
      if (whole && data && start >= Number(data.total || 0)) {
        setTone("success");
        setNote("The KJV+ Bible is installed. Every chapter can now be read with the Strong's numbers.");
      }
    } catch (error) {
      setTone("error");
      setNote(error.message || "The installer stopped.");
    } finally {
      setBusy(false);
    }
  };

  // The dictionary: the definition of the words that are read most often.
  const prepareDictionary = async () => {
    setLexiconBusy(true);
    setNote("");
    try {
      let prepared = 0;
      let remaining = 1;
      for (let round = 0; round < 30 && remaining > 0; round += 1) {
        const response = await fse2.functions.invoke("strongsDefinition", {
          action: "prepare",
          limit: 20
        });
        const data = response && response.data ? response.data : response;
        if (!data || data.error) throw new Error(data?.error || "The lexicon could not answer.");
        const entries = Array.isArray(data.entries) ? data.entries : [];
        if (entries.length) {
          await fse2.entities.StrongEntry.bulkCreate(entries);
          prepared += entries.length;
        }
        remaining = Number(data.remaining || 0);
        setLexicon({ prepared: Number(lexicon?.prepared || 0) + prepared, remaining });
        if (!entries.length) break;
      }
      setTone("success");
      setNote(
        `${prepared} definitions are now kept in the app. Every reader opens them straight away, online or offline.`
      );
    } catch (error) {
      setTone("error");
      setNote(error.message || "The dictionary could not be prepared.");
    } finally {
      setLexiconBusy(false);
    }
  };

  const installed = Number(status?.installed || 0);
  const total = Number(status?.total || 0);
  const percent = total ? Math.min(100, Math.round((installed / total) * 100)) : 0;
  const prepared = Number(lexicon?.prepared || 0);

  return (
    <div className="pr-grid pr-grid-2">
      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
          <BookOpenIcon className="h-4 w-4" style={{ display: "inline" }} /> Install the KJV+ Bible
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
          The installer copies every chapter of the King James Version into the app, with the Greek and
          Hebrew Strong&apos;s numbers marked on each word. Once a chapter is installed, the reader gets the
          marked text straight from the site, online or offline.
        </p>

        <div style={{ height: 8, borderRadius: 999, background: "var(--pr-border)", overflow: "hidden" }}>
          <div
            style={{ width: `${percent}%`, height: "100%", background: "var(--pr-emerald)", transition: "width 240ms ease" }}
          />
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "var(--pr-body)" }}>
          {installed} of {total} chapters installed ({percent}%)
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button
            type="button"
            className="pr-btn pr-btn-primary pr-btn-sm"
            onClick={() => install(false)}
            disabled={busy}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            Install the next 20 chapters
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={() => install(true)}
            disabled={busy}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
            Install the whole Bible
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={loadStatus} disabled={busy}>
            Refresh
          </button>
        </div>

        <h3
          className="pr-heading"
          style={{ margin: "22px 0 6px", fontSize: "0.95rem", fontWeight: 800 }}
        >
          <SparklesIcon className="h-4 w-4" style={{ display: "inline" }} /> Prepare the Strong&apos;s dictionary
        </h3>
        <p style={{ margin: "0 0 10px", fontSize: "0.85rem" }}>
          {prepared} definitions are kept in the app. Every blue number a reader taps then opens its
          definition straight away, without waiting for a live request.
        </p>
        <button
          type="button"
          className="pr-btn pr-btn-primary pr-btn-sm"
          onClick={prepareDictionary}
          disabled={lexiconBusy}
        >
          {lexiconBusy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}
          Look the words up
        </button>

        {note ? (
          <div className={tone === "error" ? "pr-error" : "pr-success"} style={{ marginTop: 14 }}>
            {note}
          </div>
        ) : null}
      </div>

      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
          How the reader gets the Strong&apos;s numbers
        </h2>
        <ul className="pr-list-reset" style={{ display: "grid", gap: 10, fontSize: "0.85rem" }}>
          <li>
            <strong>KJV+ is always installed</strong> on every device, next to the King James Version and
            the Luganda Bible, so the reader can pick it in the version switch of the chapter.
          </li>
          <li>
            <strong>The installed chapters come first</strong>: a reader who opens John 3 with the
            Strong&apos;s numbers gets the text from the app, even without a connection.
          </li>
          <li>
            <strong>Every blue number opens its definition</strong>, in a soft card that shows the word in
            its original language, how it is pronounced and what it means.
          </li>
          <li>
            <strong>The live public source stays the safety net</strong> for a chapter that has not been
            installed yet.
          </li>
        </ul>
      </div>
    </div>
  );
}