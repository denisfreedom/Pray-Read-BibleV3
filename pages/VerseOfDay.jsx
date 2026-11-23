import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { VERSE_OF_THE_DAY } from "@/lib/seedContent";
import { toISODate } from "@/lib/reading";
import ShareRow from "@/components/common/ShareRow";
import { SparklesIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function VerseOfDay() {
  const { isAuthenticated } = useAuth();
  const today = toISODate();

  const { data: rows } = useQuery({
    queryKey: ["verseOfDay"],
    queryFn: () => fetchPublicCollection("verseOfDay", { authenticated: isAuthenticated })
  });

  const verse = useMemo(() => {
    const list = rows && rows.length ? rows : VERSE_OF_THE_DAY;
    return list.find((row) => row.verse_date === today) || list[0];
  }, [rows, today]);

  const bookNumber = useMemo(() => {
    const reference = String(verse?.reference || "");
    const match = reference.match(/(\d+)/);
    return match ? Number(match[1]) : 19;
  }, [verse]);

  return (
    <div>
      <section className="pr-section" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container" style={{ textAlign: "center" }}>
          <span className="pr-eyebrow pr-eyebrow-light">Verse of the day</span>
          <blockquote
            className="pr-serif"
            style={{
              margin: "22px auto 0",
              maxWidth: "22ch",
              fontSize: "2rem",
              lineHeight: 1.45,
              color: "#fff"
            }}
          >
            “{verse?.text_en || verse?.text_lu}”
          </blockquote>
          <p style={{ margin: "18px 0 0", color: "var(--pr-gold)", fontWeight: 700 }}>{verse?.reference}</p>
          {verse?.text_lu ? (
            <p className="pr-serif" style={{ margin: "14px auto 0", maxWidth: "46ch", color: "rgba(255,255,255,0.8)" }}>
              {verse.text_lu}
            </p>
          ) : null}
          {verse?.note ? (
            <p style={{ margin: "18px auto 0", maxWidth: "52ch", color: "rgba(255,255,255,0.82)" }}>{verse.note}</p>
          ) : null}

          <div className="pr-hero-actions" style={{ justifyContent: "center" }}>
            <Link to={createPageUrl("Chapter") + `?book=${bookNumber}&chapter=1`} className="pr-btn pr-btn-gold">
              <SparklesIcon className="h-4 w-4" />
              Read and reflect
            </Link>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <ShareRow
              label="Share"
              text={`${verse?.text_en || ""}  -  ${verse?.reference || ""}`}
              url={`${window.location.origin}${createPageUrl("VerseOfDay")}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}