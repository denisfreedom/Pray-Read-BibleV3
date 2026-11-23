import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import BookGrid from "@/components/read/BookGrid";
import ChapterSelector from "@/components/read/ChapterSelector";
import { offline } from "@/lib/offlineDb";
import { getBookByNumber, OLD_TESTAMENT, NEW_TESTAMENT } from "@/lib/bibleBooks";
import { BookOpenIcon, ChevronLeftIcon, CloudOffIcon, LayersIcon, SparklesIcon } from "lucide-react";

const OLD_BOOK_COUNT = OLD_TESTAMENT.length;
const NEW_BOOK_COUNT = NEW_TESTAMENT.length;
const TOTAL_BOOK_COUNT = OLD_BOOK_COUNT + NEW_BOOK_COUNT;

export default function BibleReader() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("old");
  const [downloaded, setDownloaded] = useState(new Set());
  const [offlineReady, setOfflineReady] = useState(false);
  const [studySignal, setStudySignal] = useState(0);
  const [sidebarSignal, setSidebarSignal] = useState(0);

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

  const bookNumber = Number(searchParams.get("book")) || 0;
  const selectedBook = bookNumber ? getBookByNumber(bookNumber) : null;
  const selectedAccent = selectedBook && selectedBook.number <= 39 ? "#b98428" : "#2f5d8a";

  return (
    <div>
      <section className="pr-reader-top">
        <div className="pr-container">
          <div className="pr-reader-topbar">
            <div className="pr-reader-pills">
              <Link to={createPageUrl("Dashboard")} className="pr-reader-pill pr-reader-pill-dark">
                <ChevronLeftIcon className="h-4 w-4" /> Dashboard
              </Link>
              <Link to={createPageUrl("Home")} className="pr-reader-pill">
                <ChevronLeftIcon className="h-4 w-4" /> Home
              </Link>
              {selectedBook ? (
                <button
                  type="button"
                  className="pr-reader-pill pr-reader-pill-gold"
                  onClick={() => setSearchParams({})}
                >
                  <BookOpenIcon className="h-4 w-4" /> All books
                </button>
              ) : null}
            </div>

            <div className="pr-reader-pills">
              {selectedBook ? (
                <>
                  <button
                    type="button"
                    className="pr-reader-pill pr-reader-pill-note is-button"
                    onClick={() => setSidebarSignal((value) => value + 1)}
                  >
                    <BookOpenIcon className="h-4 w-4" /> Book intro, outline &amp; prayer
                  </button>
                  <button
                    type="button"
                    className="pr-reader-pill pr-reader-pill-gold is-button"
                    onClick={() => setStudySignal((value) => value + 1)}
                  >
                    <LayersIcon className="h-4 w-4" /> Study resources
                  </button>
                </>
              ) : (
                <>
                  {todayCount > 0 ? (
                    <span className="pr-reader-pill pr-reader-pill-note">
                      <BookOpenIcon className="h-4 w-4" /> {todayCount} in the reading plan
                    </span>
                  ) : null}
                  <span className="pr-reader-pill pr-reader-pill-gold">
                    <BookOpenIcon className="h-4 w-4" /> Bible Reader
                  </span>
                </>
              )}
            </div>
          </div>

          {selectedBook ? null : (
            <div className="pr-reader-hero">
              <div>
                <h1 className="pr-reader-title">Choose a book</h1>
                <p className="pr-reader-sub">Pray · Read · Listen  -  English &amp; Luganda</p>
              </div>

              <div className="pr-reader-stat">
                <span className="pr-reader-stat-icon">
                  <SparklesIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="pr-reader-stat-total">{TOTAL_BOOK_COUNT} books</p>
                  <p className="pr-reader-stat-line">
                    {OLD_BOOK_COUNT} Old Testament · {NEW_BOOK_COUNT} New Testament
                  </p>
                </div>
              </div>
            </div>
          )}

          {offlineReady && downloaded.size > 0 ? (
            <span className="pr-reader-offline">
              <CloudOffIcon className="h-4 w-4" /> {downloaded.size}{" "}
              {downloaded.size === 1 ? "book" : "books"} available offline
            </span>
          ) : null}
        </div>
      </section>

      <div className="pr-container" style={{ paddingTop: 24, paddingBottom: 56 }}>
        {selectedBook ? (
          <ChapterSelector
            book={selectedBook}
            accent={selectedAccent}
            downloaded={downloaded.has(selectedBook.number)}
            studySignal={studySignal}
            sidebarSignal={sidebarSignal}
          />
        ) : (
          <BookGrid
            search={search}
            onSearch={setSearch}
            activeTab={tab}
            onTabChange={setTab}
            downloaded={downloaded}
          />
        )}
      </div>
    </div>
  );
}