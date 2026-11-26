import React, { useCallback, useEffect, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { ensureFreshAdminToken, getAdminToken, renewAdminSession } from "@/lib/adminSession";
import {
  CheckIcon,
  DownloadIcon,
  LanguagesIcon,
  Loader2Icon,
  RefreshCwIcon,
  WrenchIcon
} from "lucide-react";
import ChapterCoverage from "@/components/admin/ChapterCoverage";

/**
 * Installs the Luganda Bible into the app.
 *
 * The installer takes every chapter from the public Luganda Bible and keeps
 * it in the app, so a reader can open any chapter in Luganda without waiting
 * for a live request, and without needing a signed-in session.
 *
 * The panel shows the audit of the install: how many of the 1,189 chapters
 * of the Bible are in the app, and which ones are still missing.
 */
export default function LugandaInstaller() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("success");

  const call = useCallback(async (action, payload = {}) => {
    const send = async () => {
      // The session is kept fresh before every round, so a long install is
      // never cut off by the clock.
      await ensureFreshAdminToken();
      const token = getAdminToken();
      const response = await fse2.functions.invoke("lugandaInstall", {
        action,
        ...(token ? { token } : {}),
        ...payload
      });
      const data = response && response.data ? response.data : response;
      if (!data) {
        throw new Error("The installer could not reach the server.");
      }
      if (data.error || data.detail) {
        // The server answered with a reason: what really happened is shown,
        // not guessed.
        throw new Error(data.error || data.detail);
      }
      if (data.status === 401) {
        throw new Error("Your admin session expired. Sign in again.");
      }
      if (data.installed === undefined) {
        throw new Error(
          "The installer could not reach the server. The background automation keeps filling the library."
        );
      }
      return data;
    };
    try {
      return await send();
    } catch (error) {
      // The session is renewed and the round is tried again, so the
      // installation carries on instead of stopping.
      if (!/session expired/i.test(error.message || "")) throw error;
      if (!(await renewAdminSession())) throw error;
      return send();
    }
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
  }, [call]);

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
        data = await call("install", { limit: 250 });
        setStatus(data);
        if (data.done) {
          setTone("success");
          setNote(
            `The Luganda Bible is installed: all ${data.total} chapters are in the app and can be read in Luganda.`
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
      const data = await call("repair", { limit: 250 });
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

  const installed = Number(status?.installed || 0);
  const ready = Number(status?.ready || 0);
  const missing = Number(status?.missing || 0);
  const broken = Number(status?.broken || 0);
  const total = Number(status?.total || 0);
  const percent = total ? Math.min(100, Math.round((ready / total) * 100)) : 0;

  return (
    <div className="pr-grid pr-grid-2">
      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
          <LanguagesIcon className="h-4 w-4" style={{ display: "inline" }} /> Install the Luganda Bible
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
          The installer copies every chapter of the Luganda Bible into the app. Once a chapter is installed,
          the reader gets the text straight from the site, online or offline, and the Luganda reading never
          depends on an outside connection.
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

      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
          How the reader gets Luganda
        </h2>
        <ul className="pr-list-reset" style={{ display: "grid", gap: 10, fontSize: "0.85rem" }}>
          <li>
            <strong>The Luganda Bible is always installed</strong> on every device, next to the King James
            Version, so the reader can pick <span translate="no">LU</span> in the version switch of the
            chapter.
          </li>
          <li>
            <strong>The installed chapters come first</strong>: a reader who opens John 3 in Luganda gets the
            text from the app, even without a connection.
          </li>
          <li>
            <strong>Every chapter that is read is kept</strong>, so the installed copy grows as the
            congregation reads.
          </li>
          <li>
            <strong>The live public source stays the safety net</strong> for a chapter that has not been
            installed yet.
          </li>
          <li>
            <strong>The install can be left to the background</strong>: the automation of the app keeps
            filling the missing chapters, and the button above picks up where it stopped.
          </li>
        </ul>
        <p className="pr-success" style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <CheckIcon className="h-4 w-4" style={{ flex: "0 0 auto", marginTop: 2 }} />
          <span>
            Every chapter is checked against the 1,189 chapters of the Bible, and its verses must be numbered
            in one run from 1 to the end, so a chapter that failed to download, or that was cut in half, is
            never counted as installed.
          </span>
        </p>
      </div>
    </div>
  );
}