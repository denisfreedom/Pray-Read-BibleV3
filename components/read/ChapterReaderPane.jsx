import React from "react";

/**
 * The reader column of the chapter page.
 *
 * The two study tabs sit above the verses. On a phone the study panel they
 * open folds in under the tabs, on a wide screen the panel lives in the left
 * column and the verses stay on the right.
 */
export default function ChapterReaderPane({ panelTab, onSelectTab, panelOpen, onTogglePanel, wideScreen, children }) {
  return (
    <>
      <div className="pr-chapter-tabs" role="tablist" aria-label="Chapter study panels">
        <button type="button" role="tab" aria-selected={panelTab === "study"} className={`pr-chapter-tab${panelTab === "study" ? " is-active" : ""}`} onClick={() => onSelectTab("study")}>
          Chapter intro, commentary &amp; prayer
        </button>
        <button type="button" role="tab" aria-selected={panelTab === "resources"} className={`pr-chapter-tab${panelTab === "resources" ? " is-active" : ""}`} onClick={() => onSelectTab("resources")}>
          Theological &amp; historical insights
        </button>
        {!wideScreen ? (
          <button type="button" className="pr-chapter-panel-toggle" aria-expanded={panelOpen} aria-controls="chapter-panel" onClick={onTogglePanel}>
            {panelOpen ? "Hide panel" : "Show panel"}
          </button>
        ) : null}
      </div>
      {children}
    </>
  );
}