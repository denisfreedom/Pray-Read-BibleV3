import React from "react";
import { SearchIcon } from "lucide-react";

// The filters of the devotional page: the language, the search, the topic
// and the date the reader is looking for.
const RANGES = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All" }
];

export default function DevotionalFilters({
  language,
  onLanguage,
  search,
  onSearch,
  topics = [],
  topic,
  onTopic,
  range,
  onRange,
  series,
  onSeries,
  seriesOptions = []
}) {
  return (
    <div className="pr-dev-toolbar">
      <div className="pr-dev-segment" role="group" aria-label="Language">
        {["EN", "LU", "BOTH"].map((id) => (
          <button
            key={id}
            type="button"
            className={`pr-dev-segment-btn ${language === id ? "pr-dev-segment-active" : ""}`}
            onClick={() => onLanguage(id)}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="pr-dev-search">
        <SearchIcon className="pr-dev-search-icon h-4 w-4" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search devotionals..."
          aria-label="Search devotionals"
        />
      </div>

      <div className="pr-dev-chips">
        <button
          type="button"
          className={`pr-chip ${topic ? "" : "pr-dev-chip-active"}`}
          onClick={() => onTopic("")}
        >
          All topics
        </button>
        {topics.map((item) => (
          <button
            key={item.id || item.name_en}
            type="button"
            className={`pr-chip ${topic === item.name_en ? "pr-dev-chip-active" : ""}`}
            onClick={() => onTopic(item.name_en)}
          >
            {item.name_en}
          </button>
        ))}
      </div>

      <div className="pr-dev-chips">
        {RANGES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pr-chip ${range === item.id ? "pr-dev-chip-active" : ""}`}
            onClick={() => onRange(item.id)}
          >
            {item.label}
          </button>
        ))}
        {seriesOptions.length ? (
          <>
            <button
              type="button"
              className={`pr-chip ${series ? "pr-dev-chip-active" : ""}`}
              onClick={() => onSeries("")}
            >
              All series
            </button>
            {seriesOptions.map((name) => (
              <button
                key={name}
                type="button"
                className={`pr-chip ${series === name ? "pr-dev-chip-active" : ""}`}
                onClick={() => onSeries(name)}
              >
                {name}
              </button>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}