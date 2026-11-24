import React, { useCallback, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { AlertTriangleIcon, CheckCircleIcon, Loader2Icon, SearchIcon } from "lucide-react";

/**
 * The cross examination of the whole library.
 *
 * The report reads what is really in the app: how many of the 1,189
 * chapters of the Bible are installed for each translation, where the two
 * translations disagree about the number of verses of a chapter, and how
 * many of the Strong's numbers the installed text uses have their meaning
 * kept in the app.
 */
export default function LibraryReport() {
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fse2.functions.invoke("scriptureAudit", { action: "status" });
      const data = response && response.data ? response.data : response;
      if (!data || data.status !== "ok") throw new Error((data && data.error) || "The report could not be made.");
      setReport(data);
    } catch (err) {
      setError(err.message || "The report could not be made.");
    } finally {
      setBusy(false);
    }
  }, []);

  const row = (label, value, tone) => (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        fontSize: "0.85rem",
        borderBottom: "1px solid var(--pr-border)",
        paddingBottom: 6
      }}
    >
      <span>{label}</span>
      <strong style={{ color: tone }}>{value}</strong>
    </li>
  );

  return (
    <div
      style={{
        marginTop: 18,
        padding: "14px 16px",
        border: "1px solid var(--pr-border)",
        borderRadius: 12,
        background: "var(--pr-ivory-soft)"
      }}
    >
      <p style={{ margin: "0 0 4px", fontSize: "0.9rem", fontWeight: 800 }}>
        Examine the whole library
      </p>
      <p style={{ margin: "0 0 12px", fontSize: "0.82rem" }}>
        One reading of the whole Bible: what is installed, what is missing, what cannot be read, and where the two
        translations do not agree.
      </p>

      <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={run} disabled={busy}>
        {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
        {busy ? "Examining…" : "Examine the library"}
      </button>

      {error ? <div className="pr-success" style={{ marginTop: 12 }}>{error}</div> : null}

      {report ? (
        <div style={{ marginTop: 14 }}>
          <ul className="pr-list-reset" style={{ display: "grid", gap: 6, padding: 0, margin: 0 }}>
            {row(
              "KJV+ chapters ready",
              `${report.kjv.ready} of ${report.kjv.total}`,
              report.kjv.ready === report.kjv.total ? "var(--pr-emerald)" : "var(--pr-gold-deep)"
            )}
            {row("KJV+ chapters missing", report.kjv.missing, report.kjv.missing ? "var(--pr-gold-deep)" : "var(--pr-emerald)")}
            {row("KJV+ chapters that cannot be read", report.kjv.broken, report.kjv.broken ? "var(--pr-gold-deep)" : "var(--pr-emerald)")}
            {row(
              "Luganda chapters ready",
              `${report.luganda.ready} of ${report.luganda.total}`,
              report.luganda.ready === report.luganda.total ? "var(--pr-emerald)" : "var(--pr-gold-deep)"
            )}
            {row("Luganda chapters missing", report.luganda.missing, report.luganda.missing ? "var(--pr-gold-deep)" : "var(--pr-emerald)")}
            {row(
              "Luganda chapters that cannot be read",
              report.luganda.broken,
              report.luganda.broken ? "var(--pr-gold-deep)" : "var(--pr-emerald)"
            )}
            {report.plain ? (
              <>
                {row(
                  "Plain KJV chapters in the verse store",
                  `${report.plain.chapters} of ${report.plain.total}`,
                  report.plain.missing ? "var(--pr-gold-deep)" : "var(--pr-emerald)"
                )}
                {row("Verses kept one by one", report.plain.verses, "var(--pr-emerald)")}
                {row(
                  "Chapters with no English text yet",
                  report.plain.chapters_without_english,
                  report.plain.chapters_without_english ? "var(--pr-gold-deep)" : "var(--pr-emerald)"
                )}
              </>
            ) : null}
            {row(
              "Chapters where the two translations disagree",
              report.disagreement_count,
              report.disagreement_count ? "var(--pr-gold-deep)" : "var(--pr-emerald)"
            )}
            {row(
              "Strong's numbers used by the text",
              `${report.strongs.cached} of ${report.strongs.used} have their meaning kept`,
              report.strongs.missing ? "var(--pr-gold-deep)" : "var(--pr-emerald)"
            )}
          </ul>

          {report.kjv.broken_chapters.length || report.luganda.broken_chapters.length ? (
            <div style={{ marginTop: 12 }}>
              <p style={{ margin: "0 0 6px", fontSize: "0.83rem", fontWeight: 700 }}>
                <AlertTriangleIcon className="h-4 w-4" style={{ display: "inline" }} /> The chapters that cannot be read
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem" }}>
                {[...report.kjv.broken_chapters, ...report.luganda.broken_chapters]
                  .slice(0, 12)
                  .map((row) => `${row.book} ${row.chapter}`)
                  .join(", ")}
                {report.kjv.broken + report.luganda.broken > 12 ? " …" : ""}
              </p>
            </div>
          ) : (
            <p style={{ margin: "12px 0 0", fontSize: "0.8rem" }}>
              <CheckCircleIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-emerald)" }} /> Every
              chapter that is installed can be read.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}