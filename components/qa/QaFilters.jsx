import React from "react";
import { SearchIcon } from "lucide-react";

const LANGUAGES = [
  { id: "en", label: "EN" },
  { id: "lu", label: "LU" },
  { id: "both", label: "BOTH" }
];

/**
 * The three controls of the Q&A page: the language of the library, the
 * word the reader is looking for, and the topic the questions belong to.
 */
export default function QaFilters({
  lang,
  onLang,
  search,
  onSearch,
  topics,
  topic,
  onTopic
}) {
  return (
    <div className="pr-qa-filters">
      <div className="pr-qa-filter-row">
        <div className="pr-lang-toggle" role="group" aria-label="Language">
          {LANGUAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`pr-lang-btn${lang === option.id ? " is-active" : ""}`}
              aria-pressed={lang === option.id}
              onClick={() => onLang(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="pr-qa-search">
          <SearchIcon className="h-4 w-4" />
          <input
            className="pr-input"
            type="search"
            value={search}
            placeholder="Search questions..."
            onChange={(event) => onSearch(event.target.value)}
            aria-label="Search questions"
          />
        </div>
      </div>
      <div className="pr-qa-topics">
        <button
          type="button"
          className={`pr-chip pr-qa-topic${topic === "All" ? " is-active" : ""}`}
          onClick={() => onTopic("All")}
        >
          All Topics
        </button>
        {topics.map((entry) => (
          <button
            key={entry.id || entry.name_en}
            type="button"
            className={`pr-chip pr-qa-topic${topic === entry.name_en ? " is-active" : ""}`}
            onClick={() => onTopic(entry.name_en)}
          >
            {lang === "lu" ? entry.name_lu : entry.name_en}
          </button>
        ))}
      </div>
    </div>
  );
}