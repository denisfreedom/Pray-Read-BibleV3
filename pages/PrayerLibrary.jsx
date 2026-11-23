import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { fetchPublicCollection } from "@/lib/contentApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { PRAYERS } from "@/lib/seedContent";
import ShareRow from "@/components/common/ShareRow";
import { HandHeartIcon, SearchIcon, BookmarkIcon, BookmarkCheckIcon, Share2Icon } from "lucide-react";

export default function PrayerLibrary() {
  const { user, isAuthenticated } = useAuth();
  const email = user?.email || null;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState([]);
  const [toast, setToast] = useState("");

  const { data: rows } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers", { authenticated: isAuthenticated })
  });

  const { data: savedRows } = useQuery({
    queryKey: ["prayerSaved", email],
    queryFn: () => fse2.entities.PrayerSaved.list("-created_date", 200),
    enabled: !!email
  });

  const saveMutation = useMutation({
    mutationFn: async ({ title, remove }) => {
      if (!email) return;
      if (remove) {
        const existing = (savedRows || []).find((row) => row.owner_email === email && row.prayer_title === title);
        if (existing) await fse2.entities.PrayerSaved.delete(existing.id);
        return;
      }
      await fse2.entities.PrayerSaved.create({ owner_email: email, prayer_title: title });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prayerSaved", email] })
  });

  const prayers = useMemo(() => {
    if (rows && rows.length) return rows;
    return PRAYERS.map((item) => ({
      ...item,
      body_en: item.body_en,
      body_lu: item.body_lu,
      scripture_ref: item.scripture_ref
    }));
  }, [rows]);

  const categories = useMemo(() => {
    const set = new Set(prayers.map((item) => item.category).filter(Boolean));
    return Array.from(set).sort();
  }, [prayers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return prayers.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchSearch =
        !query ||
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.title_lu || "").toLowerCase().includes(query) ||
        String(item.category || "").toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [prayers, search, category]);

  const savedTitles = (savedRows || [])
    .filter((row) => row.owner_email === email)
    .map((row) => row.prayer_title);

  const isSaved = (title) => savedTitles.includes(title);

  const toggleSave = (title) => {
    if (!email) {
      setToast("Sign in to save prayers");
      window.setTimeout(() => setToast(""), 2000);
      return;
    }
    setSaved((prev) => (isSaved(title) ? prev.filter((item) => item !== title) : [...prev, title]));
    saveMutation.mutate({ title, remove: isSaved(title) });
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Prayer Library</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Prayers you can pray today
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "60ch" }}>
            Morning, healing, gratitude, family, work, peace, forgiveness and guidance  -  each one in English
            and Luganda, with the scripture it rests on.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <SearchIcon
                className="h-4 w-4"
                style={{ position: "absolute", left: 14, top: 15, color: "var(--pr-gold-deep)" }}
              />
              <input
                className="pr-input"
                style={{ paddingLeft: 40 }}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search prayers…"
                aria-label="Search prayers"
              />
            </div>
            <div className="pr-tabs" style={{ borderBottom: "none" }}>
              <button
                type="button"
                className={`pr-tab ${language === "en" ? "pr-tab-active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`pr-tab ${language === "lu" ? "pr-tab-active" : ""}`}
                onClick={() => setLanguage("lu")}
              >
                Luganda
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <button
              type="button"
              className={`pr-chip ${category === "all" ? "pr-tab-active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`pr-chip ${category === item ? "pr-tab-active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="pr-empty">
            <HandHeartIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
            <p style={{ margin: "12px 0 0", fontWeight: 700 }}>No prayer matches that search.</p>
            <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>Try a different word or clear the filter.</p>
          </div>
        ) : (
          <div className="pr-grid pr-grid-2">
            {filtered.map((prayer) => (
              <div key={prayer.title} className="pr-card pr-card-pad">
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="pr-badge pr-badge-outline">{prayer.category}</span>
                  {prayer.scripture_ref ? (
                    <Link
                      to={createPageUrl("Chapter") + "?book=19&chapter=23"}
                      className="pr-link"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {prayer.scripture_ref}
                    </Link>
                  ) : null}
                </div>

                <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.15rem", fontWeight: 800 }}>
                  {language === "en" ? prayer.title : prayer.title_lu || prayer.title}
                </h2>

                <p
                  className={language === "en" ? "pr-serif" : "pr-serif"}
                  style={{ margin: "12px 0 0", fontSize: "1.02rem", lineHeight: 1.85, color: "var(--pr-heading)" }}
                >
                  {language === "en" ? prayer.body_en || prayer.body : prayer.body_lu}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
                  <button
                    type="button"
                    className="pr-btn pr-btn-outline pr-btn-sm"
                    onClick={() => toggleSave(prayer.title)}
                  >
                    {isSaved(prayer.title) ? (
                      <BookmarkCheckIcon className="h-4 w-4" />
                    ) : (
                      <BookmarkIcon className="h-4 w-4" />
                    )}
                    {isSaved(prayer.title) ? "Saved" : "Save"}
                  </button>
                  <ShareRow
                    label="Share"
                    text={`${prayer.title}\n\n${language === "en" ? prayer.body_en : prayer.body_lu}`}
                    url={`${window.location.origin}${createPageUrl("PrayerLibrary")}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="pr-success" style={{ marginTop: 20 }}>
            <Link to={createPageUrl("Login")} className="pr-link">
              Sign in
            </Link>{" "}
            to save your favourite prayers and keep them with you offline.
          </div>
        ) : null}
      </div>

      {toast ? <div className="pr-toast">{toast}</div> : null}
    </div>
  );
}