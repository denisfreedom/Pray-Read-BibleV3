import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { fse2 } from "@/api/fse2Client";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { Loader2Icon, UploadIcon } from "lucide-react";

const LANGUAGES = ["EN", "LU", "BOTH"];
const VERSIONS = ["KJV", "KJV+", "Luganda", "Darby", "Amplified"];
const MAX_AUDIO_MB = 20;

const emptySong = () => ({
  title: "",
  series_name: "",
  book_number: "",
  chapter: "",
  verse: "",
  verse_ref: "",
  language: "EN",
  version: "",
  audio_url: "",
  cover_url: "",
  lyrics_en: "",
  lyrics_lu: "",
  episode_order: "",
  active: true
});

/**
 * The form of one verse song.
 *
 * The audio can come from this device or from a link, and the cover picture
 * can be uploaded too. The chapter is checked against the book that was
 * chosen, so a wrong chapter cannot be saved.
 */
export default function VerseSongForm({ initial, seriesOptions, busy, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({ ...emptySong(), ...(initial || {}) }));
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [audioName, setAudioName] = useState("");
  const [coverName, setCoverName] = useState("");

  const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const book = BIBLE_BOOKS.find((row) => Number(row.number) === Number(values.book_number));

  const uploadAudio = async (file) => {
    if (!file) return;
    if (!/\.(mp3|m4a|wav)$/i.test(file.name)) {
      setErrors((prev) => ({ ...prev, audio: "The audio must be an MP3, M4A or WAV file." }));
      return;
    }
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, audio: `The audio file must be smaller than ${MAX_AUDIO_MB} MB.` }));
      return;
    }
    setUploading(true);
    setAudioName(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
    try {
      const { file_url } = await fse2.integrations.Core.UploadFile({ file });
      setValue("audio_url", file_url);
      setErrors((prev) => ({ ...prev, audio: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, audio: err.message || "The audio could not be uploaded." }));
    } finally {
      setUploading(false);
    }
  };

  const uploadCover = async (file) => {
    if (!file) return;
    setCoverName(file.name);
    try {
      const { file_url } = await fse2.integrations.Core.UploadFile({ file });
      setValue("cover_url", file_url);
    } catch (err) {
      setErrors((prev) => ({ ...prev, cover: err.message || "The image could not be uploaded." }));
    }
  };

  const submit = () => {
    const found = {};
    if (!values.title.trim()) found.title = "The song needs a title.";
    if (!values.series_name) found.series = "Choose the series this song belongs to.";
    if (!values.book_number) found.book = "Choose the book the song is built on.";
    const chapter = Number(values.chapter);
    if (!chapter || chapter < 1) found.chapter = "Write the chapter of the song.";
    else if (book && chapter > book.chapters) found.chapter = `${book.name} has only ${book.chapters} chapters.`;
    if (!String(values.verse).trim()) found.verse = "Write the verse of the song.";
    if (!values.audio_url.trim()) found.audio = "Upload the audio file or paste the audio link.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const chapterNumber = Number(values.chapter);
    const verseRef =
      values.verse_ref.trim() ||
      `${book ? book.name : ""} ${chapterNumber}${values.verse ? `:${values.verse}` : ""}`.trim();

    onSave({
      title: values.title.trim(),
      series_name: values.series_name,
      book_name: book ? book.name : "",
      book_number: chapterNumber ? Number(values.book_number) : 0,
      chapter: chapterNumber,
      verse: String(values.verse).trim(),
      verse_ref: verseRef,
      language: values.language,
      version: values.version,
      audio_url: values.audio_url.trim(),
      cover_url: values.cover_url.trim(),
      thumbnail: values.cover_url.trim(),
      lyrics_en: values.lyrics_en.trim(),
      lyrics_lu: values.lyrics_lu.trim(),
      episode_order: values.episode_order === "" ? 0 : Number(values.episode_order),
      active: values.active !== false
    });
  };

  return (
    <Modal
      open
      onClose={onCancel}
      title={initial && initial.id ? "Change the song" : "Add a song"}
      subtitle="Every field of the song, in one place."
      width={720}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Save the song"}
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </>
      }
    >
      {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-title">
          Title (required)
        </label>
        <input
          id="vs-song-title"
          className="pr-input"
          value={values.title}
          onChange={(event) => setValue("title", event.target.value)}
          placeholder="Genesis 1:1  -  In the Beginning"
        />
        {errors.title ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.title}</p> : null}
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-series">
          Series (required)
        </label>
        <select
          id="vs-song-series"
          className="pr-select"
          value={values.series_name}
          onChange={(event) => setValue("series_name", event.target.value)}
        >
          <option value="">Choose a series</option>
          {seriesOptions.map((option) => (
            <option key={option.id || option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.series ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.series}</p> : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-book">
            Book (required)
          </label>
          <select
            id="vs-song-book"
            className="pr-select"
            value={values.book_number}
            onChange={(event) => {
              setValue("book_number", event.target.value);
              const chosen = BIBLE_BOOKS.find((row) => Number(row.number) === Number(event.target.value));
              if (chosen && chosen.name && !values.verse_ref) {
                setValue("verse_ref", `${chosen.name} ${values.chapter || ""}${values.verse ? `:${values.verse}` : ""}`.trim());
              }
            }}
          >
            <option value="">Choose a book</option>
            {BIBLE_BOOKS.map((option) => (
              <option key={option.number} value={option.number}>
                {option.number}. {option.name}
              </option>
            ))}
          </select>
          {errors.book ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.book}</p> : null}
        </div>

        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-chapter">
            Chapter (required)
          </label>
          <input
            id="vs-song-chapter"
            className="pr-input"
            type="number"
            min="1"
            max={book ? book.chapters : 150}
            value={values.chapter}
            onChange={(event) => setValue("chapter", event.target.value)}
          />
          {errors.chapter ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.chapter}</p> : null}
        </div>

        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-verse">
            Verse (required)
          </label>
          <input
            id="vs-song-verse"
            className="pr-input"
            value={values.verse}
            onChange={(event) => setValue("verse", event.target.value)}
            placeholder="1 or 1-5"
          />
          {errors.verse ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.verse}</p> : null}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-language">
            Language (required)
          </label>
          <select
            id="vs-song-language"
            className="pr-select"
            value={values.language}
            onChange={(event) => setValue("language", event.target.value)}
          >
            {LANGUAGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-version">
            Version
          </label>
          <select
            id="vs-song-version"
            className="pr-select"
            value={values.version}
            onChange={(event) => setValue("version", event.target.value)}
          >
            <option value="">None</option>
            {VERSIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="pr-field">
          <label className="pr-label" htmlFor="vs-song-order">
            Order in the series
          </label>
          <input
            id="vs-song-order"
            className="pr-input"
            type="number"
            value={values.episode_order}
            onChange={(event) => setValue("episode_order", event.target.value)}
          />
        </div>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-audio-url">
          Audio file link
        </label>
        <input
          id="vs-song-audio-url"
          className="pr-input"
          value={values.audio_url}
          onChange={(event) => setValue("audio_url", event.target.value)}
          placeholder="https://…/genesis-1-1.mp3"
        />
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            uploadAudio(event.dataTransfer.files && event.dataTransfer.files[0]);
          }}
          style={{
            marginTop: 8,
            padding: "14px",
            border: "1px dashed var(--pr-border)",
            borderRadius: 12,
            textAlign: "center"
          }}
        >
          <input
            id="vs-song-audio-file"
            type="file"
            accept=".mp3,.m4a,.wav,audio/*"
            onChange={(event) => uploadAudio(event.target.files && event.target.files[0])}
          />
          <p className="pr-muted" style={{ margin: "8px 0 0", fontSize: "0.78rem" }}>
            <UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Drag the audio here, or choose a file.
            MP3, M4A or WAV, up to {MAX_AUDIO_MB} MB.
          </p>
          {uploading ? (
            <p className="pr-muted" style={{ margin: "6px 0 0", fontSize: "0.8rem" }}>
              <Loader2Icon className="h-4 w-4 animate-spin" style={{ display: "inline" }} /> Uploading…
            </p>
          ) : null}
          {audioName && !uploading ? (
            <p style={{ margin: "6px 0 0", fontSize: "0.82rem", fontWeight: 700 }}>{audioName}</p>
          ) : null}
        </div>
        {errors.audio ? <p className="pr-error" style={{ marginTop: 6 }}>{errors.audio}</p> : null}
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-cover">
          Cover image
        </label>
        <input
          id="vs-song-cover"
          className="pr-input"
          value={values.cover_url}
          onChange={(event) => setValue("cover_url", event.target.value)}
          placeholder="https://…/cover.jpg"
        />
        <input
          type="file"
          accept="image/*"
          style={{ marginTop: 8 }}
          onChange={(event) => uploadCover(event.target.files && event.target.files[0])}
        />
        {coverName ? <p className="pr-muted" style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>{coverName}</p> : null}
        {values.cover_url ? (
          <img
            src={values.cover_url}
            alt=""
            style={{ marginTop: 10, width: 160, height: 100, objectFit: "cover", borderRadius: 10 }}
          />
        ) : null}
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-lyrics-en">
          Lyrics / verse text (English)
        </label>
        <textarea
          id="vs-song-lyrics-en"
          className="pr-textarea"
          value={values.lyrics_en}
          onChange={(event) => setValue("lyrics_en", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-song-lyrics-lu">
          Lyrics / verse text (Luganda)
        </label>
        <textarea
          id="vs-song-lyrics-lu"
          className="pr-textarea"
          value={values.lyrics_lu}
          onChange={(event) => setValue("lyrics_lu", event.target.value)}
        />
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
        <input
          type="checkbox"
          checked={values.active !== false}
          onChange={(event) => setValue("active", event.target.checked)}
        />
        Show this song on the public site
      </label>
    </Modal>
  );
}