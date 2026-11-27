import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HERO_IMAGE } from "@/lib/theme";
import {
  filterQuestions,
  isActive,
  itemKey,
  letterCounts,
  letterOf,
  loadQaLibrary,
  questionOf,
  sortQuestions,
  sortTopics
} from "@/lib/qaLibrary";
import { copyToClipboard } from "@/lib/share";
import QaCard from "@/components/qa/QaCard";
import QaFilters from "@/components/qa/QaFilters";
import QaLetterBar from "@/components/qa/QaLetterBar";
import { Loader2Icon, WifiOffIcon } from "lucide-react";

const PAGE_SIZE = 20;
const VOTE_KEY = "pr_qa_votes";

const readVotes = () => {
  try {
    const raw = window.localStorage.getItem(VOTE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

/**
 * The Q&A page of Pray-Read.
 *
 * The questions are read from A to Z, the language can be English, Luganda
 * or both, and the three filters - the letter, the topic and the word that
 * is searched for - work together.
 */
export default function QA() {
  const [params, setParams] = useSearchParams();
  const [lang, setLang] = useState(() => {
    const value = params.get("lang");
    return value === "lu" || value === "both" ? value : "en";
  });
  const [topic, setTopic] = useState(() => params.get("topic") || "All");
  const [letter, setLetter] = useState(() => params.get("letter") || "All");
  const [search, setSearch] = useState(() => params.get("search") || "");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [votes, setVotes] = useState(readVotes);
  const [notice, setNotice] = useState("");

  const { data: library, isLoading } = useQuery({
    queryKey: ["qaLibrary"],
    queryFn: loadQaLibrary,
    staleTime: 1000 * 60 * 5
  });

  const topics = useMemo(() => sortTopics((library?.topics || []).filter(isActive)), [library]);
  const items = useMemo(
    () => (library?.items || []).filter(isActive).map((item) => ({ ...item, id: itemKey(item) })),
    [library]
  );

  // The letters are counted with the topic and the word already in place,
  // so an empty letter is empty for the reader and not for the library.
  const scoped = useMemo(
    () => filterQuestions(items, { lang, topic, search }),
    [items, lang, topic, search]
  );
  const counts = useMemo(() => letterCounts(scoped, lang), [scoped, lang]);
  const filtered = useMemo(
    () => sortQuestions(filterQuestions(items, { lang, topic, letter, search }), lang),
    [items, lang, topic, letter, search]
  );

  useEffect(() => {
    const next = new URLSearchParams();
    if (lang !== "en") next.set("lang", lang);
    if (topic && topic !== "All") next.set("topic", topic);
    if (letter && letter !== "All") next.set("letter", letter);
    if (search) next.set("search", search);
    const deep = params.get("q");
    if (deep) next.set("q", deep);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, topic, letter, search]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [lang, topic, letter, search]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // A shared link opens the question it points at, already opened.
  const deepId = params.get("q");
  useEffect(() => {
    if (!deepId) return;
    setOpenIds((previous) => (previous.has(deepId) ? previous : new Set([...previous, deepId])));
    const node = document.getElementById(`qa-item-${deepId}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [deepId, items.length]);

  const questionUrl = (item) => {
    const parts = [];
    if (item.topic_en) parts.push(`topic=${encodeURIComponent(item.topic_en)}`);
    parts.push(`letter=${encodeURIComponent(letterOf(questionOf(item, lang)))}`);
    parts.push(`q=${encodeURIComponent(item.id)}`);
    return `${window.location.origin}${createPageUrl("QA")}?${parts.join("&")}`;
  };

  const handleShare = async (item) => {
    const url = questionUrl(item);
    const text = `${item.question_en}\n\n${item.answer_en}\n\n${url}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Pray-Read Q&A", text, url });
        return;
      } catch {
        // The reader closed the sheet, so the link is copied instead.
      }
    }
    await copyToClipboard(text);
    setNotice("The link was copied to the clipboard.");
  };

  const handleCopy = async (item) => {
    const text = [
      item.question_en,
      item.answer_en,
      item.question_lu,
      item.answer_lu,
      questionUrl(item)
    ]
      .filter(Boolean)
      .join("\n\n");
    await copyToClipboard(text);
    setNotice("The question and the answer were copied to the clipboard.");
  };

  const handleVote = (item, value) => {
    const next = {
      ...votes,
      [item.id]: { yes: value === "yes" ? 1 : 0, no: value === "no" ? 1 : 0 }
    };
    setVotes(next);
    try {
      window.localStorage.setItem(VOTE_KEY, JSON.stringify(next));
    } catch {
      // The device keeps no copy of the vote, the answer still shows it.
    }
    setNotice(value === "yes" ? "Thank you for the feedback." : "Thank you, we will keep working on it.");
  };

  const toggleAnswer = (id) => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setTopic("All");
    setLetter("All");
    setSearch("");
  };

  const shown = filtered.slice(0, visible);
  const topicLabel = topic === "All" ? "All Topics" : topic;
  const countLine = `Showing ${filtered.length} question${filtered.length === 1 ? "" : "s"}${
    letter === "All" ? "" : ` under ${letter}`
  } • Topic: ${topicLabel} • Search: "${search}"`;

  return (
    <>
      <section className="pr-hero">
        <div className="pr-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="pr-hero-overlay" />
        <div className="pr-container pr-hero-inner">
          <h1 className="pr-hero-title">Questions &amp; Answers</h1>
          <p className="pr-hero-text">
            Ask, learn, and grow in the Word &mdash; in English and Luganda.
          </p>
        </div>
      </section>

      <section className="pr-section">
        <div className="pr-container">
          {library?.offline ? (
            <p className="pr-qa-offline">
              <WifiOffIcon className="h-4 w-4" style={{ display: "inline" }} /> Showing the
              copy of the Q&amp;A kept on this device.
            </p>
          ) : null}

          <QaFilters
            lang={lang}
            onLang={setLang}
            search={search}
            onSearch={setSearch}
            topics={topics}
            topic={topic}
            onTopic={setTopic}
          />

          <QaLetterBar letter={letter} onSelect={setLetter} counts={counts} />

          <div className="pr-qa-count">
            <span>{countLine}</span>
            <button type="button" className="pr-link-button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          {notice ? <p className="pr-qa-notice">{notice}</p> : null}

          {isLoading ? (
            <div className="pr-empty">
              <Loader2Icon className="h-6 w-6 animate-spin" />
              <p>Loading the questions...</p>
            </div>
          ) : null}

          {!isLoading && filtered.length === 0 ? (
            <div className="pr-card pr-card-pad pr-qa-empty">
              <h3 className="pr-qa-empty-title">
                {letter !== "All"
                  ? `No questions under ${letter} yet.`
                  : "No questions match your search yet."}
              </h3>
              <p>
                {letter !== "All"
                  ? "Ask in Admin or check another letter."
                  : "Try another word, or clear the filters to read every question."}
              </p>
              <button type="button" className="pr-btn pr-btn-gold" onClick={clearFilters}>
                Show All
              </button>
            </div>
          ) : null}

          <div className="pr-qa-list">
            {shown.map((item) => (
              <QaCard
                key={item.id}
                item={item}
                lang={lang}
                letter={letterOf(questionOf(item, lang))}
                topicLabel={lang === "lu" ? item.topic_lu : item.topic_en}
                open={openIds.has(item.id)}
                onToggle={() => toggleAnswer(item.id)}
                onShare={() => handleShare(item)}
                onCopy={() => handleCopy(item)}
                votes={votes[item.id]}
                onVote={(value) => handleVote(item, value)}
              />
            ))}
          </div>

          {filtered.length > shown.length ? (
            <div className="pr-qa-more">
              <button
                type="button"
                className="pr-btn pr-btn-outline"
                onClick={() => setVisible((current) => current + PAGE_SIZE)}
              >
                Load More
              </button>
              <span>
                Showing {shown.length} of {filtered.length}
              </span>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}