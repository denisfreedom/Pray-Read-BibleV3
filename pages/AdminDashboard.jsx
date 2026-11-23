import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { callAdmin, getAdminToken, setAdminToken } from "@/lib/adminSession";
import { DEVOTIONALS, PRAYERS, VERSE_SONGS, QA_ENTRIES, INSIGHTS } from "@/lib/seedContent";
import { LayoutDashboardIcon, BookOpenIcon, NotebookPenIcon, HandHeartIcon, MusicIcon, MessageCircleQuestionIcon, LightbulbIcon, UsersIcon, MailIcon, PaletteIcon, HistoryIcon, SettingsIcon, LogOutIcon, Loader2Icon, PlusIcon, PencilIcon, Trash2Icon, UploadIcon, ArrowLeftIcon, XIcon } from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboardIcon },
  { id: "books", label: "Books & Chapters", icon: BookOpenIcon },
  { id: "devotionals", label: "Devotionals", icon: NotebookPenIcon },
  { id: "prayers", label: "Prayer Library", icon: HandHeartIcon },
  { id: "songs", label: "Verse-Songs", icon: MusicIcon },
  { id: "qa", label: "Q&A", icon: MessageCircleQuestionIcon },
  { id: "insights", label: "Insights", icon: LightbulbIcon },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "messages", label: "Messages", icon: MailIcon },
  { id: "theme", label: "Text Colours", icon: PaletteIcon },
  { id: "activity", label: "Activity Log", icon: HistoryIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon }
];

const FIELDS = {
  Devotional: [
    ["code", "Code", "text"],
    ["title", "Title", "text"],
    ["title_lu", "Title (Luganda)", "text"],
    ["scripture", "Scripture", "text"],
    ["body", "Body (EN)", "textarea"],
    ["body_lu", "Body (LU)", "textarea"],
    ["related", "Related scriptures", "text"],
    ["further_readings", "Further readings", "text"],
    ["cover_image", "Cover image URL", "text"]
  ],
  Prayer: [
    ["title", "Title", "text"],
    ["title_lu", "Title (Luganda)", "text"],
    ["category", "Category", "text"],
    ["body_en", "Prayer (EN)", "textarea"],
    ["body_lu", "Prayer (LU)", "textarea"],
    ["scripture_ref", "Scripture", "text"]
  ],
  VerseSongSeries: [
    ["name", "Series name", "text"],
    ["description", "Description", "textarea"],
    ["thumbnail", "Thumbnail URL", "text"],
    ["accent", "Accent colour", "text"]
  ],
  VerseSongEpisode: [
    ["series_name", "Series name", "text"],
    ["title", "Episode title", "text"],
    ["verse_ref", "Verse reference", "text"],
    ["duration_label", "Duration label", "text"],
    ["duration_seconds", "Duration (seconds)", "number"],
    ["audio_url", "Audio URL", "text"],
    ["episode_order", "Order", "number"]
  ],
  QAEntry: [
    ["question", "Question", "textarea"],
    ["category", "Category", "text"],
    ["answer", "Answer", "textarea"],
    ["passage_ref", "Bible passage", "text"],
    ["status", "Status", "text"]
  ],
  Insight: [
    ["kind", "Type (theological | historical)", "text"],
    ["title", "Title", "text"],
    ["passage", "Passage", "text"],
    ["excerpt", "Excerpt", "textarea"],
    ["body", "Body", "textarea"]
  ],
  LiveSession: [
    ["title", "Title", "text"],
    ["session_date", "Date and time", "text"],
    ["host", "Host", "text"],
    ["join_link", "Join link", "text"],
    ["description", "Description", "textarea"]
  ],
  DiscussionGroup: [
    ["name", "Group name", "text"],
    ["description", "Description", "textarea"],
    ["schedule", "Meeting schedule", "text"],
    ["member_count", "Members", "number"]
  ],
  Commentary: [
    ["book", "Book", "text"],
    ["chapter", "Chapter", "number"],
    ["title", "Title", "text"],
    ["body_en", "Commentary (EN)", "textarea"],
    ["body_lu", "Commentary (LU)", "textarea"]
  ],
  VerseOfDay: [
    ["verse_date", "Date", "text"],
    ["reference", "Reference", "text"],
    ["text_en", "Verse (EN)", "textarea"],
    ["text_lu", "Verse (LU)", "textarea"],
    ["note", "Reflection note", "textarea"]
  ]
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [importText, setImportText] = useState("");
  const [importKind, setImportKind] = useState("verses");
  const [importBook, setImportBook] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [settings, setSettings] = useState({ ivory: "#faf8f2", emerald: "#1d4035", gold: "#e9c981" });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordNote, setPasswordNote] = useState("");

  const collectionFor = useMemo(
    () => ({
      books: "BibleVerse",
      devotionals: "Devotional",
      prayers: "Prayer",
      songs: "VerseSongSeries",
      qa: "QAEntry",
      insights: "Insight"
    }),
    []
  );

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate(createPageUrl("Admin"));
      return;
    }
    callAdmin("session")
      .then((data) => {
        if (!data || !data.valid) {
          setAdminToken("");
          navigate(createPageUrl("Admin"));
          return;
        }
        setReady(true);
      })
      .catch(() => {
        setAdminToken("");
        navigate(createPageUrl("Admin"));
      });
  }, [navigate]);

  const loadStats = async () => {
    try {
      const data = await callAdmin("stats");
      setStats(data);
    } catch (err) {
      setMessage(err.message || "Could not load the dashboard.");
    }
  };

  useEffect(() => {
    if (!ready) return;
    loadStats();
    const entity = collectionFor[section];
    if (!entity) return;
    callAdmin("list", { entity })
      .then((data) => setRows(data.rows || []))
      .catch(() => setRows([]));
  }, [ready, section, collectionFor]);

  const openCreate = (entity) => {
    setEditing({ entity, id: null });
    setForm({});
  };

  const openEdit = (entity, row) => {
    setEditing({ entity, id: row.id });
    const copy = {};
    FIELDS[entity].forEach(([key]) => {
      copy[key] = row[key] === undefined || row[key] === null ? "" : row[key];
    });
    setForm(copy);
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setMessage("");
    try {
      const values = {};
      Object.entries(form).forEach(([key, value]) => {
        values[key] = value === "" ? null : value;
      });
      if (editing.id) await callAdmin("update", { entity: editing.entity, id: editing.id, values });
      else await callAdmin("create", { entity: editing.entity, values });
      setEditing(null);
      const data = await callAdmin("list", { entity: editing.entity });
      setRows(data.rows || []);
      loadStats();
      setMessage("Saved.");
    } catch (err) {
      setMessage(err.message || "Could not save that record.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (entity, id) => {
    setBusy(true);
    try {
      await callAdmin("delete", { entity, id });
      const data = await callAdmin("list", { entity });
      setRows(data.rows || []);
      loadStats();
      setMessage("Deleted.");
    } catch (err) {
      setMessage(err.message || "Could not delete that record.");
    } finally {
      setBusy(false);
    }
  };

  const runImport = async () => {
    setBusy(true);
    setImportResult(null);
    try {
      const result = await callAdmin("bulkImport", { kind: importKind, text: importText, bookName: importBook });
      setImportResult(result);
      loadStats();
    } catch (err) {
      setImportResult({ inserted: 0, errors: [err.message] });
    } finally {
      setBusy(false);
    }
  };

  const saveTheme = async () => {
    setBusy(true);
    setMessage("");
    try {
      const existing = await callAdmin("list", { entity: "SiteSettings" });
      const rowsToWrite = Object.entries(settings).map(([key, value]) => ({ setting_key: key, setting_value: value }));
      const current = (existing.rows || []).filter((row) => ["ivory", "emerald", "gold"].includes(row.setting_key));
      for (const row of current) {
        await callAdmin("update", { entity: "SiteSettings", id: row.id, values: { setting_key: row.setting_key, setting_value: settings[row.setting_key] } });
      }
      const known = new Set(current.map((row) => row.setting_key));
      for (const entry of rowsToWrite) {
        if (!known.has(entry.setting_key)) {
          await callAdmin("create", { entity: "SiteSettings", values: entry });
        }
      }
      setMessage("Theme colours updated on the live site.");
    } catch (err) {
      setMessage(err.message || "Could not save the theme.");
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async () => {
    setBusy(true);
    setPasswordNote("");
    try {
      if (passwordForm.next !== passwordForm.confirm) {
        setPasswordNote("The new password and the confirmation do not match.");
        return;
      }
      const result = await callAdmin("changePassword", {
        current: passwordForm.current,
        next: passwordForm.next
      });
      if (result && result.error) {
        setPasswordNote(result.error);
        return;
      }
      setPasswordForm({ current: "", next: "", confirm: "" });
      setPasswordNote("Password updated. The old password no longer works.");
    } catch (err) {
      setPasswordNote(err.message || "Could not change the password.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <div className="pr-container pr-section" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Loader2Icon className="h-5 w-5 animate-spin" style={{ color: "var(--pr-gold-deep)" }} />
        <span>Checking your admin session…</span>
      </div>
    );
  }

  const entity = collectionFor[section];
  const fields = entity ? FIELDS[entity] : null;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald-deep)" }}>
        <div className="pr-container">
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
              <ArrowLeftIcon className="h-4 w-4" /> View site
            </Link>
            <span className="pr-eyebrow pr-eyebrow-light" style={{ marginLeft: "auto" }}>
              Administration
            </span>
            <button
              type="button"
              className="pr-btn pr-btn-light-outline pr-btn-sm"
              onClick={() => {
                setAdminToken("");
                navigate(createPageUrl("Admin"));
              }}
            >
              <LogOutIcon className="h-4 w-4" /> Logout
            </button>
          </div>
          <h1 className="pr-serif" style={{ margin: "14px 0 0", color: "#fff", fontSize: "2rem" }}>
            Pray-Read content manager
          </h1>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid" style={{ gridTemplateColumns: "1fr", gap: 24 }}>
          <div className="pr-tabs">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`pr-tab ${section === item.id ? "pr-tab-active" : ""}`}
                onClick={() => setSection(item.id)}
              >
                <item.icon className="h-4 w-4" style={{ display: "inline" }} /> {item.label}
              </button>
            ))}
          </div>

          {message ? <div className="pr-success">{message}</div> : null}

          {section === "overview" ? (
            <div>
              <div className="pr-grid pr-grid-4">
                {[
                  { label: "Users", value: stats?.users ?? 0 },
                  { label: "Devotionals", value: stats?.devotionals ?? 0 },
                  { label: "Prayers", value: stats?.prayers ?? 0 },
                  { label: "Verse-song series", value: stats?.verseSongs ?? 0 },
                  { label: "Q&A entries", value: stats?.qa ?? 0 },
                  { label: "Insights", value: stats?.insights ?? 0 },
                  { label: "Stored verses", value: stats?.verses ?? 0 },
                  { label: "Messages", value: stats?.messages ?? 0 }
                ].map((stat) => (
                  <div key={stat.label} className="pr-stat">
                    <p className="pr-stat-value">{stat.value}</p>
                    <p className="pr-stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="pr-card pr-card-pad" style={{ marginTop: 20 }}>
                <h2 className="pr-heading" style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 800 }}>
                  Recent activity
                </h2>
                {(stats?.activity || []).length === 0 ? (
                  <p style={{ margin: 0, fontSize: "0.88rem" }}>No activity recorded yet.</p>
                ) : (
                  <ul className="pr-list-reset" style={{ display: "grid", gap: 10 }}>
                    {(stats?.activity || []).map((row) => (
                      <li key={row.id} style={{ fontSize: "0.86rem", borderBottom: "1px solid var(--pr-border)", paddingBottom: 8 }}>
                        <strong>{row.actor}</strong> {row.action} · {row.section}
                        {row.detail ? `  -  ${row.detail}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}

          {section === "books" ? (
            <div className="pr-grid pr-grid-2">
              <div className="pr-card pr-card-pad">
                <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                  Bulk import chapters
                </h2>
                <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
                  Paste chapters as blocks. Each block starts with book:chapter:verse, then the English text,
                  then the Luganda text. Devotional blocks start with the code and then carry the title,
                  title in Luganda, scripture, scripture in Luganda, body and body in Luganda.
                </p>
                {importKind === "verses" ? (
                  <div className="pr-field" style={{ marginBottom: 12 }}>
                    <label className="pr-label" htmlFor="import-book">
                      Book name for these verses
                    </label>
                    <input
                      id="import-book"
                      className="pr-input"
                      value={importBook}
                      onChange={(event) => setImportBook(event.target.value)}
                      placeholder="For example: John"
                    />
                  </div>
                ) : null}
                <div className="pr-tabs" style={{ borderBottom: "none" }}>
                  <button
                    type="button"
                    className={`pr-tab ${importKind === "verses" ? "pr-tab-active" : ""}`}
                    onClick={() => setImportKind("verses")}
                  >
                    Bible chapters
                  </button>
                  <button
                    type="button"
                    className={`pr-tab ${importKind === "devotionals" ? "pr-tab-active" : ""}`}
                    onClick={() => setImportKind("devotionals")}
                  >
                    Devotional batches
                  </button>
                </div>
                <textarea
                  className="pr-textarea"
                  style={{ marginTop: 12, minHeight: 160, fontFamily: "monospace", fontSize: "0.8rem" }}
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                  placeholder={
                    importKind === "verses"
                      ? "19:23:1\nThe LORD is my shepherd; I shall not want.\nMukama ye musumba wange; seetaagenga."
                      : "D-007\nThe Good Shepherd\nMfumu Mukaliro\nPsalm 23:1\nZabalam 23:1\nBody text\nAmateka y'omuliro"
                  }
                />
                <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" style={{ marginTop: 12 }} onClick={runImport} disabled={busy}>
                  {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
                  Validate and import
                </button>

                {importResult ? (
                  <div className="pr-success" style={{ marginTop: 14 }}>
                    <p style={{ margin: 0 }}>{importResult.inserted} records inserted.</p>
                    {importResult.errors && importResult.errors.length ? (
                      <ul className="pr-list-reset" style={{ marginTop: 8 }}>
                        {importResult.errors.map((item, index) => (
                          <li key={index} style={{ fontSize: "0.8rem" }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="pr-card pr-card-pad">
                <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                  Stored verses
                </h2>
                <p style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
                  {rows.length} verse records in the database. The reader prefers stored verses, then the live
                  public source.
                </p>
                <ul className="pr-list-reset" style={{ display: "grid", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                  {rows.slice(0, 60).map((row) => (
                    <li key={row.id} style={{ fontSize: "0.8rem", borderBottom: "1px solid var(--pr-border)", paddingBottom: 6 }}>
                      <strong>
                        {row.book || row.book_number} {row.chapter}:{row.verse}
                      </strong>{" "}
                      {row.text_en}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {entity && fields ? (
            <div className="pr-card pr-card-pad">
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <h2 className="pr-heading" style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, textTransform: "capitalize" }}>
                  {entity} ({rows.length})
                </h2>
                <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" style={{ marginLeft: "auto" }} onClick={() => openCreate(entity)}>
                  <PlusIcon className="h-4 w-4" /> New record
                </button>
              </div>

              {rows.length === 0 ? (
                <p style={{ margin: "16px 0 0", fontSize: "0.88rem" }}>
                  Nothing stored yet. Add the first record, or publish the built-in library from the seed content.
                </p>
              ) : (
                <div className="pr-scroll-x" style={{ marginTop: 14 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                        {fields.slice(0, 4).map(([key, label]) => (
                          <th key={key} style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}>
                            {label}
                          </th>
                        ))}
                        <th style={{ padding: "8px 10px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                          {fields.slice(0, 4).map(([key]) => (
                            <td key={key} style={{ padding: "8px 10px", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {String(row[key] ?? "")}
                            </td>
                          ))}
                          <td style={{ padding: "8px 10px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button type="button" className="pr-icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(entity, row)} aria-label="Edit">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button type="button" className="pr-icon-btn" style={{ width: 32, height: 32 }} onClick={() => remove(entity, row.id)} aria-label="Delete">
                                <Trash2Icon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {section === "users" ? (
            <UsersPanel onMessage={setMessage} />
          ) : null}

          {section === "messages" ? (
            <MessagesPanel onMessage={setMessage} />
          ) : null}

          {section === "theme" ? (
            <div className="pr-card pr-card-pad">
              <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                Text colours and theme
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
                These values update the live site immediately for every reader.
              </p>
              {["ivory", "emerald", "gold"].map((key) => (
                <div className="pr-field" key={key}>
                  <label className="pr-label" htmlFor={`colour-${key}`}>
                    {key}
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      id={`colour-${key}`}
                      type="color"
                      value={settings[key]}
                      onChange={(event) => setSettings((prev) => ({ ...prev, [key]: event.target.value }))}
                      style={{ width: 52, height: 46, borderRadius: 12, border: "1px solid var(--pr-border)", padding: 4, background: "#fff" }}
                    />
                    <input
                      className="pr-input"
                      value={settings[key]}
                      onChange={(event) => setSettings((prev) => ({ ...prev, [key]: event.target.value }))}
                    />
                  </div>
                </div>
              ))}
              <button type="button" className="pr-btn pr-btn-primary" onClick={saveTheme} disabled={busy}>
                {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                Apply to the live site
              </button>
            </div>
          ) : null}

          {section === "activity" ? (
            <div className="pr-card pr-card-pad">
              <h2 className="pr-heading" style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 800 }}>
                Activity log
              </h2>
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {(stats?.activity || []).map((row) => (
                  <li key={row.id} style={{ fontSize: "0.85rem" }}>
                    <strong>{row.actor}</strong> {row.action} · {row.section}
                    {row.detail ? `  -  ${row.detail}` : ""}
                  </li>
                ))}
                {(stats?.activity || []).length === 0 ? <li style={{ fontSize: "0.88rem" }}>No activity yet.</li> : null}
              </ul>
            </div>
          ) : null}

          {section === "settings" ? (
            <div className="pr-grid pr-grid-2">
              <div className="pr-card pr-card-pad">
                <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                  Update admin password
                </h2>
                <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
                  The current password is verified before the new one is stored. Old sessions stop working
                  immediately.
                </p>
                <div className="pr-field">
                  <label className="pr-label" htmlFor="current-password">
                    Current password
                  </label>
                  <input
                    id="current-password"
                    className="pr-input"
                    type="password"
                    value={passwordForm.current}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
                  />
                </div>
                <div className="pr-field">
                  <label className="pr-label" htmlFor="next-password">
                    New password
                  </label>
                  <input
                    id="next-password"
                    className="pr-input"
                    type="password"
                    value={passwordForm.next}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
                  />
                </div>
                <div className="pr-field">
                  <label className="pr-label" htmlFor="confirm-password">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    className="pr-input"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
                  />
                </div>
                {passwordNote ? <div className="pr-success">{passwordNote}</div> : null}
                <button type="button" className="pr-btn pr-btn-primary" style={{ marginTop: 14 }} onClick={changePassword} disabled={busy}>
                  {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                  Update password
                </button>
              </div>

              <div className="pr-card pr-card-pad">
                <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                  Site settings
                </h2>
                <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
                  These values feed the public pages, the share text and the install prompt.
                </p>
                <ul className="pr-list-reset" style={{ display: "grid", gap: 10, fontSize: "0.86rem" }}>
                  <li>
                    <strong>Site name:</strong> Pray-Read Bible
                  </li>
                  <li>
                    <strong>Donation link:</strong> store.pesapal.com/donatetoprayreadbibleproject
                  </li>
                  <li>
                    <strong>Default images:</strong> generated brand assets in the app's public folder
                  </li>
                  <li>
                    <strong>Built-in libraries:</strong> {DEVOTIONALS.length} devotionals, {PRAYERS.length} prayers,{" "}
                    {VERSE_SONGS.length} verse-song series, {QA_ENTRIES.length} Q&A entries, {INSIGHTS.length} insights
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {editing ? (
        <div className="pr-modal-backdrop" onClick={() => setEditing(null)} role="presentation">
          <div className="pr-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="pr-modal-head">
              <button type="button" className="pr-modal-close" onClick={() => setEditing(null)} aria-label="Close">
                <XIcon className="h-4 w-4" />
              </button>
              <h2 className="pr-serif" style={{ margin: 0, fontSize: "1.3rem", color: "#fff" }}>
                {editing.id ? "Edit" : "New"} {editing.entity}
              </h2>
            </div>
            <div className="pr-modal-body">
              {FIELDS[editing.entity].map(([key, label, type]) => (
                <div className="pr-field" key={key}>
                  <label className="pr-label" htmlFor={`field-${key}`}>
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      id={`field-${key}`}
                      className="pr-textarea"
                      value={form[key] ?? ""}
                      onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                    />
                  ) : (
                    <input
                      id={`field-${key}`}
                      className="pr-input"
                      type={type}
                      value={form[key] ?? ""}
                      onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                    />
                  )}
                </div>
              ))}
              <button type="button" className="pr-btn pr-btn-primary" onClick={save} disabled={busy}>
                {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                Save record
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UsersPanel({ onMessage }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    callAdmin("users")
      .then((data) => setRows(data.rows || []))
      .catch(() => setRows([]));
  }, []);

  const filtered = rows.filter(
    (row) =>
      !search ||
      String(row.email || "").toLowerCase().includes(search.toLowerCase()) ||
      String(row.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pr-card pr-card-pad">
      <h2 className="pr-heading" style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 800 }}>
        Users ({rows.length})
      </h2>
      <input
        className="pr-input"
        style={{ marginBottom: 14 }}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or email…"
      />
      {filtered.length === 0 ? (
        <p style={{ margin: 0, fontSize: "0.88rem" }}>No readers have signed up yet.</p>
      ) : (
        <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
          {filtered.map((row) => (
            <li key={row.id} style={{ fontSize: "0.85rem", borderBottom: "1px solid var(--pr-border)", paddingBottom: 8 }}>
              <strong>{row.full_name || "Unnamed reader"}</strong> · {row.email} · role: {row.role || "user"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MessagesPanel({ onMessage }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    callAdmin("list", { entity: "ContactMessage" })
      .then((data) => setRows(data.rows || []))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="pr-card pr-card-pad">
      <h2 className="pr-heading" style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 800 }}>
        Contact messages ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <p style={{ margin: 0, fontSize: "0.88rem" }}>No messages yet.</p>
      ) : (
        <ul className="pr-list-reset" style={{ display: "grid", gap: 12 }}>
          {rows.map((row) => (
            <li key={row.id} style={{ fontSize: "0.85rem", borderBottom: "1px solid var(--pr-border)", paddingBottom: 10 }}>
              <strong>{row.name}</strong> · {row.email}
              <p style={{ margin: "6px 0 0" }}>{row.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}