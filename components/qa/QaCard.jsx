import React from "react";
import { Link } from "react-router-dom";
import { chapterLink } from "@/lib/scriptureRefs";
import { splitAnswerParts } from "@/lib/qaLibrary";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, Share2Icon, StarIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

/** An answer, with every scripture reference picked out in gold. */
const AnswerBody = ({ text }) => (
  <>
    {splitAnswerParts(text).map((part, index) =>
      part.reference ? (
        <strong key={index} className="pr-qa-ref">
          {part.text}
        </strong>
      ) : (
        <span key={index}>{part.text}</span>
      )
    )}
  </>
);

/**
 * One question of the Q&A library.
 *
 * The answer is closed until the reader asks for it, so a long list of
 * questions still reads well on a phone.
 */
export default function QaCard({
  item,
  lang,
  letter,
  topicLabel,
  open,
  onToggle,
  onShare,
  onCopy,
  votes,
  onVote
}) {
  const showLuganda = lang === "lu" || lang === "both";
  const showEnglish = lang === "en" || lang === "both";
  const scriptureLink = item.scripture_ref ? chapterLink(item.scripture_ref) : "";
  const yes = (votes?.yes || 0) + Number(item.helpful_count || 0);
  const no = votes?.no || 0;

  return (
    <article className="pr-card pr-card-pad pr-qa-card" id={`qa-item-${item.id}`}>
      <div className="pr-qa-card-top">
        <span className="pr-qa-letter" aria-hidden="true">
          {letter}
        </span>
        <div className="pr-qa-badges">
          {topicLabel ? <span className="pr-badge pr-badge-gold">{topicLabel}</span> : null}
          {item.scripture_ref ? (
            scriptureLink ? (
              <Link to={scriptureLink} className="pr-badge pr-badge-outline">
                {item.scripture_ref}
              </Link>
            ) : (
              <span className="pr-badge pr-badge-outline">{item.scripture_ref}</span>
            )
          ) : null}
          {item.featured ? (
            <span className="pr-badge pr-badge-gold">
              <StarIcon className="h-3 w-3" style={{ display: "inline" }} /> Featured
            </span>
          ) : null}
        </div>
      </div>

      {showEnglish ? (
        <h3 className="pr-qa-question">{item.question_en}</h3>
      ) : null}
      {showLuganda ? (
        <div className="pr-qa-question-lu">
          <span className="pr-badge pr-badge-gold pr-qa-lu-badge">LU</span>
          <p>{item.question_lu}</p>
        </div>
      ) : null}

      <button type="button" className="pr-qa-answer-toggle" onClick={onToggle}>
        {open ? "Hide Answer" : "Read Answer"}
        {open ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {open ? (
        <div className="pr-qa-answer">
          {showEnglish ? (
            <p>
              <AnswerBody text={item.answer_en} />
            </p>
          ) : null}
          {showLuganda ? (
            <div className="pr-qa-answer-lu">
              <span className="pr-badge pr-badge-gold pr-qa-lu-badge">LU</span>
              <p>
                <AnswerBody text={item.answer_lu} />
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="pr-qa-card-foot">
        <button type="button" className="pr-qa-action" onClick={onShare}>
          <Share2Icon className="h-4 w-4" /> Share
        </button>
        <button type="button" className="pr-qa-action" onClick={onCopy}>
          <CopyIcon className="h-4 w-4" /> Copy
        </button>
        <span className="pr-qa-votes">
          <button type="button" className="pr-qa-action" onClick={() => onVote("yes")}>
            <ThumbsUpIcon className="h-4 w-4" /> {yes}
          </button>
          <button type="button" className="pr-qa-action" onClick={() => onVote("no")}>
            <ThumbsDownIcon className="h-4 w-4" /> {no}
          </button>
        </span>
      </div>
    </article>
  );
}