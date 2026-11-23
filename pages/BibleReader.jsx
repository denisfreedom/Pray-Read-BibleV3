import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import BookGrid from "@/components/read/BookGrid";
import { offline } from "@/lib/offlineDb";
import { getBookByNumber } from "@/lib/bibleBooks";
import { ArrowLeftIcon, BookOpenIcon, CloudOffIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function BibleReader() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("old");
  const [downloaded, setDownloaded] = useState(new Set());
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    let active = true;
    offline
      .getAll("chapters")
      .then((rows) => {
        if (!active) return;
        // A book only counts as available offline when every one of its
        // chapters is stored on this device.
        const perBook = new Map();
        rows.forEach((row) => {
          if (!row || !row.book_number) return;
          const key = `${Number(row.book_number)}:${row.language || "en"}`;
          perBook.set(key, (perBook.get(key) || 0) + 1);
        });
        const set = new Set();
        perBook.forEach((count, key) => {
          const bookNumber = Number(key.split(":")[0]);
          const book = getBookByNumber(bookNumber);
          if (book && book.chapters && count >= book.chapters) set.add(bookNumber);
        });
        setDownloaded(set);
        setOfflineReady(true);
      })
      .catch(() => setOfflineReady(true));
    return () => {
      active = false;
    };
  }, []);

  const { data: planRows } = useQuery({
    queryKey: ["readingPlan"],
    queryFn: () => fetchPublicCollection("plan", { authenticated: isAuthenticated })
  });

  const todayCount = (planRows || []).length;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <Link to={createPageUrl("Dashboard")} className="pr-btn pr-btn-light-outline pr-btn-sm">
              <ArrowLeftIcon className="h-4 w-4" /> Dashboard
            </Link>
            <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
              <ArrowLeftIcon className="h-4 w-4" /> Home
            </Link>
            <span
              className="pr-chip"
              style={{ marginLeft: "auto", background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
            >
              <BookOpenIcon className="h-4 w-4" /> Bible Reader
            </span>
          </div>

          <span className="pr-eyebrow pr-eyebrow-light">Pray · Read · Listen</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.3rem" }}>
            Choose a book
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)" }}>
            English &amp; Luganda  -  {todayCount ? `${todayCount} chapters in the reading plan` : "the whole Bible"}
          </p>

          <div className="pr-grid pr-grid-3" style={{ marginTop: 22 }}>
            {[
              { label: "Books", value: 66 },
              { label: "Old Testament", value: 39 },
              { label: "New Testament", value: 27 }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 18,
                  padding: "14px 18px"
                }}
              >
                <p style={{ margin: 0, color: "#fff", fontSize: "1.6rem", fontWeight: 800 }}>{stat.value}</p>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.72)", fontSize: "0.78rem" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {offlineReady && downloaded.size > 0 ? (
            <div
              style={{
                marginTop: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(233,201,129,0.16)",
                border: "1px solid rgba(233,201,129,0.4)",
                color: "#f6e3b6",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: "0.78rem",
                fontWeight: 700
              }}
            >
              <CloudOffIcon className="h-4 w-4" />
              {downloaded.size} {downloaded.size === 1 ? "book" : "books"} available offline
            </div>
          ) : null}
        </div>
      </section>

      <div className="pr-container pr-section">
        <BookGrid
          search={search}
          onSearch={setSearch}
          activeTab={tab}
          onTabChange={setTab}
          downloaded={downloaded}
        />
      </div>
    </div>
  );
}