import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { INSIGHTS, PRAYERS } from "@/lib/seedContent";
import {
  getChapterCommentary,
  getChapterIntro,
  getChapterKeyPassages,
  getChapterPrayer
} from "@/lib/chapterStudy";
import { parseReference } from "@/lib/scriptureRefs";
import { selectionInside } from "@/lib/textSelection";
import AnnotatedText from "@/components/read/AnnotatedText";
import { BookOpenIcon, HeartHandshakeIcon, MessageCircleIcon, Icon } from "lucide-react";

const EMPTY = [];

// The three sections of the study panel. Only one of them is open at a time,
// the reader moves between them with the small tab bar, the same way the book
// reader moves between the book intro, the outline and the book prayer.
const SECTIONS = [
  { key: "intro", label: "Intro", Icon: BookOpenIcon },
  { key: "commentary", label: "Commentary", Icon: MessageCircleIcon },
  { key: "prayer", label: "Prayer", Icon: HeartHandshakeIcon }
];

// The panel carries the short form of the closing prayer. The full prayer
// closes the chapter at the foot of the page, so the same words are never
// read twice.
const shorten = (text, limit = 300) => {
  const value = String(text || "").trim();
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 140 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

/**
 * The left hand panel of the chapter reader.
 *
 * It carries three sections: the introduction to this chapter, the commentary
 * on it and the prayer that closes it. Only one section is open at a time and
 * it scrolls on its own, the text can be marked, and every scripture reference
 * opens in the popup so the reader never leaves the chapter.
 */
export default function ChapterSidebar({
  book,
  chapter,
  verses = EMPTY,
  language = "en",
  annotations = EMPTY,
  onAnnotate,
  onRemove,
  onOpenPassage,
  panelOpen = false,
  activeSection = "intro",
  onSectionChange
}) {
  const bookNumber = book ? book.number : 0;

  const { data: commentaryRows = EMPTY } = useQuery({
    queryKey: ["chapterCommentary"],
    queryFn: () => fetchPublicCollection("commentary")
  });
  const { data: insightRows = EMPTY } = useQuery({
    queryKey: ["chapterInsights"],
    queryFn: () => fetchPublicCollection("insights")
  });
  const { data: prayerRows = EMPTY } = useQuery({
    queryKey: ["chapterPrayers"],
    queryFn: () => fetchPublicCollection("prayers")
  });

  const intro = useMemo(
    () => getChapterIntro(book, chapter, verses),
    [bookNumber, chapter, verses]
  );
  const commentary = useMemo(
    () =>
      getChapterCommentary(book, chapter, {
        commentary: commentaryRows,
        insights: [...insightRows, ...INSIGHTS]
      }),
    [bookNumber, chapter, commentaryRows, insightRows]
  );
  const prayers = useMemo(
    () => getChapterPrayer(book, chapter, { prayers: [...prayerRows, ...PRAYERS] }),
    [bookNumber, chapter, prayerRows]
  );
  const keyPassages = useMemo(
    () => getChapterKeyPassages(book, chapter),
    [bookNumber, chapter]
  );

  const forBlock = (blockId) =>
    annotations.filter((annotation) => annotation.block_id === blockId);

  const openReference = (label, event) => {
    if (event && selectionInside(event.currentTarget)) return;
    const reference = parseReference(label);
    if (reference && onOpenPassage) onOpenPassage(reference);
  };

  if (!book || !intro) return null;

  const introBlock = `chapter-intro-${bookNumber}-${chapter}`;
  const commentaryBlock = `chapter-commentary-${bookNumber}-${chapter}`;
  const prayerBlock = `chapter-prayer-${bookNumber}-${chapter}`;

  return (
    <aside className={`pr-chapter-side${panelOpen ? " is-open" : ""}`} id="chapter-panel">
      <div className="pr-chapter-subtabs" role="tablist" aria-label="Chapter study sections">
        {SECTIONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeSection === key}
            className={`pr-chapter-subtab${activeSection === key ? " is-active" : ""}`}
            onClick={() => onSectionChange && onSectionChange(key)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeSection === "intro" ? (
        <section className="pr-chapter-card" id="chapter-intro-panel">
          <header className="pr-chapter-card-head">
            <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="pr-chapter-card-title">Chapter intro</p>
              <p className="pr-chapter-card-sub">
                {book.name} {chapter}
              </p>
            </div>
          </header>
          <div className="pr-chapter-scroll">
            <h3 className="pr-chapter-heading">{intro.heading}</h3>
            {intro.range ? <p className="pr-chapter-range">{intro.range}</p> : null}
            <AnnotatedText
              blockId={introBlock}
              section="chapter-intro"
              text={intro.body}
              annotations={forBlock(introBlock)}
              onAnnotate={onAnnotate}
              onRemove={onRemove}
              className="pr-chapter-body"
            />
            {intro.anchor ? (
              <blockquote className="pr-chapter-anchor">
                <span className="pr-chapter-anchor-verse" translate="no">
                  {intro.anchor.verse}
                </span>
                {intro.anchor.text}
              </blockquote>
            ) : null}
            {keyPassages.length ? (
              <div className="pr-chapter-refs">
                {keyPassages.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="pr-chapter-ref"
                    onClick={(event) => openReference(label, event)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="pr-chapter-hint">
              Select any text to highlight or underline it. Tap a passage to read it here.
            </p>
          </div>
        </section>
      ) : null}

      {activeSection === "commentary" ? (
        <section className="pr-chapter-card" id="chapter-commentary-panel">
          <header className="pr-chapter-card-head">
            <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="pr-chapter-card-title">Chapter commentary</p>
              <p className="pr-chapter-card-sub">
                {commentary.length} note{commentary.length === 1 ? "" : "s"}
              </p>
            </div>
          </header>
          <div className="pr-chapter-scroll">
            {commentary.length === 0 ? (
              <p className="pr-chapter-hint" style={{ marginTop: 0 }}>
                Nothing has been written about {book.name} {chapter} yet.
              </p>
            ) : null}
            {commentary.map((note, index) => (
              <article key={`${note.kind}-${index}`} className="pr-chapter-note">
                {note.badge ? <span className="pr-chapter-badge">{note.badge}</span> : null}
                <p className="pr-chapter-note-title">{note.title}</p>
                <AnnotatedText
                  blockId={`${commentaryBlock}-${index}`}
                  section="chapter-commentary"
                  text={note.body}
                  annotations={forBlock(`${commentaryBlock}-${index}`)}
                  onAnnotate={onAnnotate}
                  onRemove={onRemove}
                  className="pr-chapter-note-body"
                />
                {language === "both" && note.bodyLu ? (
                  <AnnotatedText
                    blockId={`${commentaryBlock}-${index}-lu`}
                    section="chapter-commentary"
                    text={note.bodyLu}
                    annotations={forBlock(`${commentaryBlock}-${index}-lu`)}
                    onAnnotate={onAnnotate}
                    onRemove={onRemove}
                    className="pr-chapter-note-body is-lu"
                  />
                ) : null}
              </article>
            ))}
            <p className="pr-chapter-hint">
              Select any text to highlight or underline it. Your notes stay with this chapter.
            </p>
          </div>
        </section>
      ) : null}

      {activeSection === "prayer" ? (
        <section className="pr-chapter-card" id="chapter-prayer-panel">
          <header className="pr-chapter-card-head">
            <HeartHandshakeIcon className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="pr-chapter-card-title">Closing prayer</p>
              <p className="pr-chapter-card-sub">To close {book.name} {chapter}</p>
            </div>
          </header>
          <div className="pr-chapter-scroll">
            {prayers.map((prayer, index) => {
              const english = prayer.body || "";
              const luganda = prayer.bodyLu || "";
              const text =
                (language === "lu" ? luganda || english : english || luganda) || "";
              if (!text) return null;
              const luText = language === "both" && luganda ? shorten(luganda) : "";
              return (
                <article key={`prayer-${index}`} className="pr-chapter-prayer">
                  <p className="pr-chapter-prayer-title">
                    {language === "lu" && prayer.titleLu ? prayer.titleLu : prayer.title}
                  </p>
                  <AnnotatedText
                    blockId={`${prayerBlock}-${index}`}
                    section="chapter-prayer"
                    text={shorten(text)}
                    annotations={forBlock(`${prayerBlock}-${index}`)}
                    onAnnotate={onAnnotate}
                    onRemove={onRemove}
                    className="pr-chapter-prayer-body"
                  />
                  {luText ? (
                    <AnnotatedText
                      blockId={`${prayerBlock}-${index}-lu`}
                      section="chapter-prayer"
                      text={luText}
                      annotations={forBlock(`${prayerBlock}-${index}-lu`)}
                      onAnnotate={onAnnotate}
                      onRemove={onRemove}
                      className="pr-chapter-prayer-body is-lu"
                    />
                  ) : null}
                  {prayer.ref ? (
                    <button
                      type="button"
                      className="pr-chapter-ref"
                      onClick={(event) => openReference(prayer.ref, event)}
                    >
                      {prayer.ref}
                    </button>
                  ) : null}
                </article>
              );
            })}
            <button
              type="button"
              className="pr-chapter-ref"
              onClick={() => {
                const node = document.getElementById("chapter-closing-prayer");
                if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Read the full closing prayer at the end of the chapter
            </button>
            <p className="pr-chapter-hint">
              Select any text to highlight or underline it. Tap the reference to read the verse here.
            </p>
          </div>
        </section>
      ) : null}
    </aside>
  );
}