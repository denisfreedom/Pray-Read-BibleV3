import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { DEVOTIONALS } from "@/lib/seedContent";
import { chapterLink } from "@/lib/scriptureRefs";
import { formatLugandaDevotional, formatEnglishDevotional } from "@/lib/luganda";
import { devotionalShareText } from "@/lib/share";
import { STORAGE_KEYS, DEFAULT_COVER } from "@/lib/theme";
import { toISODate } from "@/lib/reading";
import Modal from "@/components/common/Modal";
import ShareRow from "@/components/common/ShareRow";
import { BookOpenIcon, CalendarIcon, FlameIcon, CheckCircleIcon, ListIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


const readDone = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.doneDevotionals) || "[]");
  } catch {
    return [];
  }
};

export default function Devotionals() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("devotional");
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [openCode, setOpenCode] = useState(requested || null);
  const [done, setDone] = useState(readDone());
  const [toast, setToast] = useState("");

  const { data: rows } = useQuery({
    queryKey: ["devotionals"],
    queryFn: () => fetchPublicCollection("devotionals", { authenticated: isAuthenticated })
  });

  const email = user?.email || null;

  const { data: progressRows } = useQuery({
    queryKey: ["devotionalProgress", email],
    queryFn: () => fse2.entities.DevotionalProgress.list("-completed_date", 300),
    enabled: !!email
  });

  // Completions saved on another device are merged into this device.
  useEffect(() => {
    if (!email || !progressRows) return;
    const serverCodes = (progressRows || [])
      .filter((row) => row.owner_email === email && row.devotional_code)
      .map((row) => row.devotional_code);
    if (!serverCodes.length) return;
    setDone((current) => {
      const merged = Array.from(new Set([...current, ...serverCodes]));
      if (merged.length === current.length) return current;
      localStorage.setItem(STORAGE_KEYS.doneDevotionals, JSON.stringify(merged));
      return merged;
    });
  }, [progressRows, email]);

  const devotionals = useMemo(() => {
    if (rows && rows.length) return rows;
    return DEVOTIONALS.map((item) => ({ ...item, publish_date: "", day: item.code }));
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return devotionals;
    return devotionals.filter(
      (item) =>
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.code || "").toLowerCase().includes(query) ||
        String(item.title_lu || "").toLowerCase().includes(query)
    );
  }, [devotionals, search]);

  const current = devotionals.find((item) => item.code === openCode) || null;
  const streak = done.length;

  const markComplete = async (code) => {
    if (done.includes(code)) return;
    const next = [...done, code];
    setDone(next);
    localStorage.setItem(STORAGE_KEYS.doneDevotionals, JSON.stringify(next));
    if (email) {
      try {
        await fse2.entities.DevotionalProgress.create({
          owner_email: email,
          devotional_code: code,
          completed_date: toISODate()
        });
        await queryClient.invalidateQueries({ queryKey: ["devotionalProgress", email] });
        setToast("Marked as complete and saved to your account");
      } catch {
        setToast("Marked as complete on this device");
      }
    } else {
      setToast("Marked as complete");
    }
    window.setTimeout(() => setToast(""), 2000);
  };

  const english = current ? formatEnglishDevotional(current.body) : null;
  const luganda = current ? formatLugandaDevotional(current.body_lu) : null;

  const shareUrl = current
    ? `${window.location.origin}${createPageUrl("Devotionals")}?devotional=${current.code}`
    : window.location.origin;

  const shareText = current
    ? devotionalShareText(
        {
          title: current.title,
          reference: current.scripture,
          body: current.body,
          related: current.related || current.scripture,
          furtherReadings: current.further_readings || "Psalm 23; John 1"
        },
        shareUrl
      )
    : "";

  return (
    <div>
      <section
        className="pr-hero"
        style={{ backgroundImage: `url(${DEFAULT_COVER})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="pr-hero-overlay" />
        <div className="pr-container pr-hero-inner">
          <span className="pr-eyebrow pr-eyebrow-light">Daily Devotionals</span>
          <h1 className="pr-hero-title">Short, rich devotionals to deepen your faith</h1>
          <p className="pr-hero-text">
            In English and Luganda, each devotional opens with a passage and ends with something to pray about
            tonight.
          </p>
          <div className="pr-hero-actions">
            <button
              type="button"
              className="pr-btn pr-btn-gold"
              onClick={() => {
                setView("list");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Explore
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-light-outline"
              onClick={() => setView((value) => (value === "calendar" ? "list" : "calendar"))}
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar view
            </button>
            {streak > 0 ? (
              <span
                className="pr-chip"
                style={{ background: "rgba(233,201,129,0.18)", color: "#f6e3b6", borderColor: "rgba(233,201,129,0.4)" }}
              >
                <FlameIcon className="h-4 w-4" /> Your streak: {streak} devotional
                {streak === 1 ? "" : "s"} completed
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ marginBottom: 24 }}>
          <label htmlFor="devotional-search" className="pr-label">
            Search by title or code
          </label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              id="devotional-search"
              className="pr-input"
              style={{ flex: "1 1 260px" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search devotionals… e.g. Psalms, D-001"
            />
            <div className="pr-tabs" style={{ borderBottom: "none" }}>
              <button
                type="button"
                className={`pr-tab ${view === "list" ? "pr-tab-active" : ""}`}
                onClick={() => setView("list")}
              >
                <ListIcon className="h-4 w-4" style={{ display: "inline" }} /> List
              </button>
              <button
                type="button"
                className={`pr-tab ${view === "calendar" ? "pr-tab-active" : ""}`}
                onClick={() => setView("calendar")}
              >
                <CalendarIcon className="h-4 w-4" style={{ display: "inline" }} /> Calendar
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="pr-empty">
            <p style={{ margin: 0, fontWeight: 700 }}>No devotional matches “{search}”.</p>
            <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>Try the code, such as D-001.</p>
          </div>
        ) : view === "calendar" ? (
          <div className="pr-grid pr-grid-3">
            {filtered.map((item, index) => (
              <button
                key={item.code}
                type="button"
                className="pr-card pr-card-hover pr-card-pad"
                style={{ textAlign: "left", cursor: "pointer", borderTop: "4px solid var(--pr-gold)" }}
                onClick={() => setOpenCode(item.code)}
              >
                <span className="pr-badge pr-badge-gold">Day {index + 1}</span>
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
                  {item.title}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
                  {item.scripture}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="pr-grid pr-grid-2">
            {filtered.map((item) => (
              <div key={item.code} className="pr-card pr-card-hover" style={{ overflow: "hidden" }}>
                <img
                  src={item.cover_image || DEFAULT_COVER}
                  alt=""
                  style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }}
                />
                <div className="pr-card-pad">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="pr-badge pr-badge-gold">{item.code}</span>
                    {done.includes(item.code) ? (
                      <span className="pr-badge pr-badge-emerald">
                        <CheckCircleIcon className="h-3 w-3" /> Completed
                      </span>
                    ) : null}
                  </div>
                  <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>
                    {item.title}
                  </h2>
                  <p className="pr-serif" style={{ margin: "6px 0 0", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
                    {item.scripture}
                  </p>
                  <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>
                    {String(item.body || "").split("\n\n")[0]}
                  </p>
                  <button
                    type="button"
                    className="pr-btn pr-btn-primary pr-btn-sm"
                    style={{ marginTop: 14 }}
                    onClick={() => setOpenCode(item.code)}
                  >
                    <BookOpenIcon className="h-4 w-4" /> Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(current)}
        onClose={() => setOpenCode(null)}
        title={current?.title || ""}
        subtitle={current ? `${current.code} · ${current.scripture}` : ""}
      >
        {current ? (
          <div>
            <ShareRow text={shareText} url={shareUrl} />

            <div className="pr-card" style={{ padding: 18, marginTop: 18, background: "var(--pr-ivory-soft)" }}>
              <p className="pr-eyebrow">Scripture</p>
              <p className="pr-serif" style={{ margin: "10px 0 0", fontSize: "1.1rem", lineHeight: 1.8, color: "var(--pr-heading)" }}>
                {current.scripture_lu || current.scripture}
              </p>
            </div>

            <div className="pr-tabs" style={{ marginTop: 22 }}>
              <button type="button" className="pr-tab pr-tab-active">English</button>
              <button
                type="button"
                className="pr-tab"
                onClick={(event) => {
                  const parent = event.currentTarget.parentElement;
                  const children = Array.from(parent.children);
                  const index = children.indexOf(event.currentTarget);
                  children.forEach((child, childIndex) => {
                    child.className = childIndex === index ? "pr-tab pr-tab-active" : "pr-tab";
                  });
                  const panels = document.getElementById("devotional-language-panels");
                  if (panels) {
                    const panelChildren = Array.from(panels.children);
                    panelChildren.forEach((child, childIndex) => {
                      child.style.display = childIndex === index ? "block" : "none";
                    });
                  }
                }}
              >
                Luganda
              </button>
            </div>

            <div id="devotional-language-panels" style={{ marginTop: 18 }}>
              <div>
                {english.paragraphs.map((block, index) => (
                  <p
                    key={`en-${index}`}
                    className="pr-serif"
                    style={{
                      margin: "0 0 14px",
                      fontSize: "1.05rem",
                      lineHeight: 1.85,
                      color: "var(--pr-heading)",
                      fontWeight: block.heading ? 700 : 400
                    }}
                  >
                    {block.text}
                  </p>
                ))}
              </div>

              <div style={{ display: "none" }}>
                {luganda.verse ? (
                  <p className="pr-serif" style={{ margin: "0 0 14px", fontSize: "1.05rem", lineHeight: 1.85, color: "var(--pr-heading)" }}>
                    {luganda.verse}
                  </p>
                ) : null}
                {luganda.reflection ? (
                  <>
                    <p className="pr-eyebrow">Okufumiitiriza</p>
                    <p className="pr-serif" style={{ margin: "8px 0 16px", fontSize: "1.02rem", lineHeight: 1.85, color: "var(--pr-heading)" }}>
                      {luganda.reflection}
                    </p>
                  </>
                ) : null}
                {luganda.application ? (
                  <>
                    <p className="pr-eyebrow">Okukozesa mu Bulamu</p>
                    <p className="pr-serif" style={{ margin: "8px 0 16px", fontSize: "1.02rem", lineHeight: 1.85, color: "var(--pr-heading)" }}>
                      {luganda.application}
                    </p>
                  </>
                ) : null}
                {luganda.prayer ? (
                  <>
                    <p className="pr-eyebrow">Okuliriza</p>
                    <p className="pr-serif" style={{ margin: "8px 0 16px", fontSize: "1.02rem", lineHeight: 1.85, color: "var(--pr-heading)" }}>
                      {luganda.prayer}
                    </p>
                  </>
                ) : null}
                {luganda.paragraphs.map((block, index) => (
                  <p key={`lu-${index}`} className="pr-serif" style={{ margin: "0 0 14px", fontSize: "1.02rem", lineHeight: 1.85, color: "var(--pr-heading)" }}>
                    {block}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button
                type="button"
                className={`pr-btn ${done.includes(current.code) ? "pr-btn-outline" : "pr-btn-gold"}`}
                onClick={() => markComplete(current.code)}
                disabled={done.includes(current.code)}
              >
                <CheckCircleIcon className="h-4 w-4" />
                {done.includes(current.code) ? "Completed" : "Mark complete"}
              </button>
              {chapterLink(current.scripture) ? (
                <Link to={chapterLink(current.scripture)} className="pr-btn pr-btn-outline">
                  Read {current.scripture}
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      {toast ? <div className="pr-toast">{toast}</div> : null}
    </div>
  );
}