import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { DEVOTIONALS } from "@/lib/seedContent";
import { HERO_IMAGE } from "@/lib/theme";
import { shiftISODate, toISODate } from "@/lib/reading";
import { fullShareChannels } from "@/lib/share";
import {
  bodyOf,
  buildDevotionalShareText,
  coverOf,
  devotionalDate,
  devotionalKey,
  devotionalUrl,
  excerptOf,
  longDateLabel,
  mergeWithBundledText,
  pickDailyDevotional,
  rememberDaily,
  scriptureOf,
  sortDevotionals,
  titleOf,
  topicOf,
  visibleDevotionals
} from "@/lib/devotionals";
import useDevotionalLibrary from "@/lib/useDevotionalLibrary";
import DevotionalFilters from "@/components/devotional/DevotionalFilters";
import DevotionalCard from "@/components/devotional/DevotionalCard";
import DevotionalFeatured from "@/components/devotional/DevotionalFeatured";
import DevotionalFullView from "@/components/devotional/DevotionalFullView";
import ShareSheet from "@/components/read/ShareSheet";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";

const PAGE_SIZE = 12;

const daysAgo = (iso, days) => {
  if (!iso) return false;
  const from = shiftISODate(toISODate(), -days);
  return iso >= from && iso <= toISODate();
};

const matchesSearch = (row, term) => {
  if (!term) return true;
  const needle = term.toLowerCase();
  return [
    row.title_en,
    row.title_lu,
    row.verse_en,
    row.verse_lu,
    row.body_en,
    row.body_lu,
    row.topic,
    row.scripture_ref
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
};

/**
 * The devotional page.
 *
 * The devotional of the day is at the top, the previous days follow, and
 * the whole library is below with the filters of the reader: the language,
 * the search, the topic and the date.
 */
export default function Devotionals() {
  const today = toISODate();
  const [language, setLanguage] = useState("BOTH");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [range, setRange] = useState("all");
  const [series, setSeries] = useState("");
  const [openKey, setOpenKey] = useState("");
  const [shareRow, setShareRow] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { data: dbRows, isLoading } = useQuery({
    queryKey: ["devotionals"],
    queryFn: () => fetchPublicCollection("devotionals")
  });

  const { data: dbTopics } = useQuery({
    queryKey: ["devotionalTopics"],
    queryFn: () => fetchPublicCollection("devotionalTopics")
  });

  const rows = useMemo(() => {
    const list = Array.isArray(dbRows) && dbRows.length ? dbRows : DEVOTIONALS;
    return sortDevotionals(mergeWithBundledText(list));
  }, [dbRows]);

  const topics = useMemo(() => {
    const list = (Array.isArray(dbTopics) ? dbTopics : []).filter((item) => item.active !== false);
    if (list.length) {
      return list.map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_lu: item.name_lu,
        active: true
      }));
    }
    // Until the content manager writes the topics, the ones the devotionals
    // carry themselves are used, so the filter is never empty.
    const names = [...new Set(rows.map(topicOf).filter(Boolean))].sort();
    return names.map((name, index) => ({
      id: `topic-${index}`,
      name_en: name,
      name_lu: "",
      active: true
    }));
  }, [dbTopics, rows]);

  const seriesOptions = useMemo(() => {
    const names = rows.map((row) => String(row.series || "").trim()).filter(Boolean);
    return [...new Set(names)].sort();
  }, [rows]);

  const daily = useMemo(
    () => pickDailyDevotional(rows, today, shiftISODate(today, -1)),
    [rows, today]
  );

  useEffect(() => {
    if (daily) rememberDaily(today, devotionalKey(daily));
  }, [daily, today]);

  // A devotional that is pasted as a link opens straight away.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("devotional");
    if (!wanted) return;
    const match = rows.find((row) => devotionalKey(row) === wanted);
    if (match) setOpenKey(devotionalKey(match));
  }, [rows]);

  const library = useDevotionalLibrary();

  const shown = useMemo(() => {
    const published = visibleDevotionals(rows, today);
    return published.filter((row) => {
      if (!matchesSearch(row, search.trim())) return false;
      if (topic && topicOf(row) !== topic) return false;
      if (series && String(row.series || "") !== series) return false;
      const date = devotionalDate(row);
      if (range === "today" && date !== today) return false;
      if (range === "week" && !daysAgo(date, 6)) return false;
      if (range === "month" && !daysAgo(date, 29)) return false;
      return true;
    });
  }, [rows, today, search, topic, series, range]);

  const previousDays = useMemo(() => {
    const published = visibleDevotionals(rows, today);
    const older = published.filter((row) => devotionalDate(row) && devotionalDate(row) < today);
    return older.slice(0, 3);
  }, [rows, today]);

  const openRow = useMemo(
    () => rows.find((row) => devotionalKey(row) === openKey) || null,
    [rows, openKey]
  );

  const neighbours = useMemo(() => {
    if (!openRow) return { prev: null, next: null };
    const index = shown.findIndex((row) => devotionalKey(row) === devotionalKey(openRow));
    const source = index >= 0 ? shown : visibleDevotionals(rows, today);
    const at = source.findIndex((row) => devotionalKey(row) === devotionalKey(openRow));
    if (at < 0) return { prev: null, next: null };
    // The list runs from the newest day to the oldest, so the day after is
    // the one above and the day before the one below.
    const before = source.slice(0, at);
    const after = source.slice(at + 1);
    return {
      next: before.length ? before.pop() : null,
      prev: after.length ? after.shift() : null
    };
  }, [openRow, shown, rows, today]);

  const shareUrl = shareRow ? devotionalUrl(shareRow) : "";
  const shareText = shareRow ? buildDevotionalShareText(shareRow, shareUrl, language) : "";

  // The social preview of the devotional that is open.
  useEffect(() => {
    if (!openRow) return undefined;
    const title = `${titleOf(openRow, "EN")}  -  Pray-Read Devotional`;
    const description = excerptOf(bodyOf(openRow, "EN"), 1);
    document.title = title;
    const setMeta = (attribute, name, content) => {
      const selector = "meta[" + attribute + "='" + name + "']";
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", coverOf(openRow));
    setMeta("property", "og:url", devotionalUrl(openRow));
    setMeta("name", "description", description);
    return undefined;
  }, [openRow]);

  const openDevotional = (row) => {
    if (!row) return;
    setOpenKey(devotionalKey(row));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToList = () => {
    setOpenKey("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (openRow) {
    return (
      <div className="pr-page">
        <main className="pr-main">
          <section className="pr-section-tight">
            <div className="pr-container">
              <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={backToList}>
                <ArrowLeftIcon className="h-4 w-4" /> All devotionals
              </button>
              <div style={{ marginTop: 18 }}>
                <DevotionalFullView
                  row={openRow}
                  language={language}
                  onBack={(row) => (row ? openDevotional(row) : backToList())}
                  onShare={(row) => setShareRow(row)}
                  prev={neighbours.prev}
                  next={neighbours.next}
                  saved={library.isSaved(openRow)}
                  onToggleSave={library.toggleSave}
                  read={library.isRead(openRow)}
                  onMarkRead={library.markRead}
                  more={shown
                    .filter((row) => devotionalKey(row) !== devotionalKey(openRow))
                    .slice(0, 3)}
                />
              </div>
            </div>
          </section>
        </main>

        <ShareSheet
          open={!!shareRow}
          onClose={() => setShareRow(null)}
          title="Share this Devotional"
          subtitle={shareRow ? titleOf(shareRow, language) : ""}
          text={shareText}
          url={shareUrl}
          subject={shareRow ? titleOf(shareRow, language) : ""}
          preview={
            shareRow
              ? {
                  image: coverOf(shareRow),
                  title: titleOf(shareRow, language),
                  line: `${scriptureOf(shareRow, language)}  -  ${excerptOf(bodyOf(shareRow, language), 1)}`,
                  link: shareUrl
                }
              : null
          }
          channels={fullShareChannels}
        />
      </div>
    );
  }

  return (
    <div className="pr-page">
      <main className="pr-main">
        <section className="pr-dev-hero">
          <div className="pr-dev-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
          <div className="pr-dev-hero-inner">
            <div className="pr-container">
              <p className="pr-eyebrow pr-eyebrow-light">Pray · Read · Live the Word</p>
              <h1 className="pr-dev-hero-title">Daily Devotionals</h1>
              <p className="pr-dev-hero-sub">
                A fresh word for today  -  read, pray, and share it.
              </p>
            </div>
          </div>
        </section>

        <section className="pr-section-tight">
          <div className="pr-container">
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Loader2Icon className="h-8 w-8 animate-spin" style={{ color: "var(--pr-emerald)" }} />
              </div>
            ) : null}

            {!isLoading && !rows.length ? (
              <div className="pr-empty">
                <h2 className="pr-dev-title">No devotionals yet  -  check back tomorrow.</h2>
                <p style={{ marginTop: 8 }}>
                  The first devotional of the day will appear here as soon as it is written.
                </p>
              </div>
            ) : null}

            {!isLoading && rows.length ? (
              <>
                <DevotionalFeatured
                  row={daily}
                  language={language}
                  onOpen={openDevotional}
                  onShare={(row) => setShareRow(row)}
                  saved={daily ? library.isSaved(daily) : false}
                  onToggleSave={library.toggleSave}
                />

                {previousDays.length ? (
                  <div style={{ marginTop: 34 }}>
                    <h2 className="pr-section-title" style={{ fontSize: "1.3rem" }}>
                      Previous Days
                    </h2>
                    <div className="pr-dev-prev" style={{ marginTop: 14 }}>
                      {previousDays.map((row) => (
                        <button
                          key={row.id || row.code}
                          type="button"
                          className="pr-dev-prev-card"
                          style={{ textAlign: "left", cursor: "pointer" }}
                          onClick={() => openDevotional(row)}
                        >
                          <img className="pr-dev-prev-cover" src={coverOf(row)} alt="" loading="lazy" />
                          <span>
                            <span className="pr-dev-date" style={{ display: "block" }}>
                              {longDateLabel(devotionalDate(row))}
                            </span>
                            <strong style={{ color: "var(--pr-heading)" }}>{titleOf(row, language)}</strong>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <DevotionalFilters
                  language={language}
                  onLanguage={setLanguage}
                  search={search}
                  onSearch={(value) => {
                    setSearch(value);
                    setVisible(PAGE_SIZE);
                  }}
                  topics={topics.filter((item) => item.active)}
                  topic={topic}
                  onTopic={setTopic}
                  range={range}
                  onRange={setRange}
                  series={series}
                  onSeries={setSeries}
                  seriesOptions={seriesOptions}
                />

                <div style={{ marginTop: 26 }}>
                  <h2 className="pr-section-title" style={{ fontSize: "1.3rem" }}>
                    All Devotionals
                  </h2>
                  {!shown.length ? (
                    <div className="pr-empty" style={{ marginTop: 16 }}>
                      <p>No devotional matches that search yet.</p>
                    </div>
                  ) : null}
                  <div className="pr-dev-grid" style={{ marginTop: 16 }}>
                    {shown.slice(0, visible).map((row) => (
                      <DevotionalCard
                        key={row.id || row.code}
                        row={row}
                        language={language}
                        onOpen={openDevotional}
                        onShare={(item) => setShareRow(item)}
                        saved={library.isSaved(row)}
                        onToggleSave={library.toggleSave}
                      />
                    ))}
                  </div>
                  {shown.length > visible ? (
                    <div className="pr-dev-load">
                      <button
                        type="button"
                        className="pr-btn pr-btn-outline pr-btn-sm"
                        onClick={() => setVisible((count) => count + PAGE_SIZE)}
                      >
                        Load More
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>

      <ShareSheet
        open={!!shareRow}
        onClose={() => setShareRow(null)}
        title="Share this Devotional"
        subtitle={shareRow ? titleOf(shareRow, language) : ""}
        text={shareText}
        url={shareUrl}
        subject={shareRow ? titleOf(shareRow, language) : ""}
        preview={
          shareRow
            ? {
                image: coverOf(shareRow),
                title: titleOf(shareRow, language),
                line: `${scriptureOf(shareRow, language)}  -  ${excerptOf(bodyOf(shareRow, language), 1)}`,
                link: shareUrl
              }
            : null
        }
        channels={fullShareChannels}
      />
    </div>
  );
}