import React, { useCallback, useEffect, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { getAdminToken } from "@/lib/adminSession";
import { DownloadIcon, LanguagesIcon, Loader2Icon } from "lucide-react";

/**
 * Installs the Luganda Bible into the app.
 *
 * The installer takes every chapter from the public Luganda Bible and keeps
 * it in the app, so a reader can open any chapter in Luganda without waiting
 * for a live request, and without needing a signed-in session.
 */
export default function LugandaInstaller() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("success");

  const call = useCallback(async (action, payload = {}) => {
    const response = await fse2.functions.invoke("lugandaInstall", {
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
        setNote("The Luganda Bible is installed. Every chapter can now be read in Luganda.");
      }
    } catch (error) {
      setTone("error");
      setNote(error.message || "The installer stopped.");
    } finally {
      setBusy(false);
    }
  };

  const installed = Number(status?.installed || 0);
  const total = Number(status?.total || 0);
  const percent = total ? Math.min(100, Math.round((installed / total) * 100)) : 0;

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

        {note ? (
          <div className={tone === "error" ? "pr-error" : "pr-success"} style={{ marginTop: 14 }}>
            {note}
          </div>
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
        </ul>
      </div>
    </div>
  );
}