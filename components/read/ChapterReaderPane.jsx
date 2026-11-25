import React, { useEffect, useRef, useState } from "react";
import { BookOpenIcon, HeartHandshakeIcon, Link2Icon, MenuIcon, MessageCircleIcon, Icon } from "lucide-react";

// The study sections the reader can open from the menu.
const SECTIONS = [
  { key: "intro", label: "Intro", Icon: BookOpenIcon },
  { key: "commentary", label: "Commentary", Icon: MessageCircleIcon },
  { key: "prayer", label: "Prayer", Icon: HeartHandshakeIcon },
  { key: "crossrefs", label: "Cross-refs", Icon: Link2Icon }
];

/**
 * The reader column of the chapter page.
 *
 * The tab bar above the verses carries a menu button that opens the three
 * study sections (the chapter intro, the commentary and the prayer) and one
 * named tab, Resources, for the theological and historical insights.
 *
 * On a phone the study panel the menu opens folds in under the bar, on a wide
 * screen the panel lives in the left column and the verses stay on the right.
 */
export default function ChapterReaderPane({
  panelTab,
  onSelectTab,
  panelOpen,
  onTogglePanel,
  wideScreen,
  section = "intro",
  onSelectSection,
  children
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const chooseSection = (key) => {
    setMenuOpen(false);
    if (onSelectSection) onSelectSection(key);
  };

  return (
    <>
      <div className="pr-chapter-tabs">
        <div className="pr-chapter-menu-wrap" ref={menuWrapRef}>
          <button
            type="button"
            className={`pr-chapter-menu-btn${panelTab === "study" ? " is-active" : ""}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Chapter study menu: intro, commentary, prayer and cross-references"
            title="Chapter intro, commentary, prayer and cross-references"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div className="pr-chapter-menu" role="menu" aria-label="Chapter study sections">
              {SECTIONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  role="menuitemradio"
                  aria-checked={section === key}
                  className={`pr-chapter-menu-item${section === key ? " is-active" : ""}`}
                  onClick={() => chooseSection(key)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pr-chapter-tablist" role="tablist" aria-label="Chapter panels">
          <button
            type="button"
            role="tab"
            aria-selected={panelTab === "resources"}
            className={`pr-chapter-tab${panelTab === "resources" ? " is-active" : ""}`}
            onClick={() => onSelectTab("resources")}
          >
            Resources
          </button>
        </div>

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