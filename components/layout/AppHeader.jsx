import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HomeIcon, UsersIcon, HandHeartIcon, BookOpenIcon, MusicIcon, MessageCircleQuestionIcon, NotebookPenIcon, LayoutDashboardIcon, BellIcon, LogInIcon, LogOutIcon, MenuIcon, XIcon, CloudOffIcon, HighlighterIcon, DownloadIcon, CalendarDaysIcon, SparklesIcon, LandmarkIcon, LightbulbIcon, VideoIcon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { LOGO_URL, DONATE_URL, DONATE_LINK_PROPS } from "@/lib/theme";

const NAV_ITEMS = [
  { name: "About", label: "About", icon: UsersIcon },
  { name: "Community", label: "Community", icon: UsersIcon },
  { name: "PrayerLibrary", label: "Prayer Library", icon: HandHeartIcon },
  { name: "BibleReader", label: "Bible Reader", icon: BookOpenIcon },
  { name: "VerseSongs", label: "Verse-Songs", icon: MusicIcon },
  { name: "QA", label: "Q&A", icon: MessageCircleQuestionIcon },
  { name: "Devotionals", label: "Devotionals", icon: NotebookPenIcon },
  { name: "Dashboard", label: "Dashboard", icon: LayoutDashboardIcon }
];

const SECONDARY_ITEMS = [
  { name: "TheologicalInsights", label: "Theological insights", icon: LightbulbIcon },
  { name: "HistoricalInsights", label: "Historical insights", icon: LandmarkIcon },
  { name: "VerseOfDay", label: "Verse of the day", icon: SparklesIcon },
  { name: "Plan", label: "Reading plan", icon: CalendarDaysIcon },
  { name: "Journal", label: "Prayer journal", icon: NotebookPenIcon },
  { name: "Offline", label: "Offline centre", icon: DownloadIcon },
  { name: "BibleNotes", label: "My notes", icon: HighlighterIcon },
  { name: "CommunityRevelations", label: "Revelations", icon: LightbulbIcon },
  { name: "CommunityLiveTeaching", label: "Live teaching", icon: VideoIcon },
  { name: "DiscussionGroups", label: "Discussion groups", icon: UsersIcon }
];

export default function AppHeader({ currentPageName }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [currentPageName]);

  const linkClass = (name) =>
    `pr-nav-link ${currentPageName === name ? "pr-nav-link-active" : ""}`;

  return (
    <header className="pr-header">
      <div className="pr-container pr-header-inner">
        <Link to={createPageUrl("Home")} className="pr-brand" aria-label="Pray Read home">
          <span className="pr-brand-tile">
            {logoFailed ? (
              <span className="pr-serif" style={{ color: "var(--pr-emerald)", fontWeight: 700 }}>
                PR
              </span>
            ) : (
              <img
                src={LOGO_URL}
                alt="Pray Read Bible"
                className="pr-brand-logo"
                onError={() => setLogoFailed(true)}
              />
            )}
          </span>
        </Link>

        <nav className="pr-nav-desktop" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.name} to={createPageUrl(item.name)} className={linkClass(item.name)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pr-header-actions">
          {!online ? (
            <span className="pr-offline-badge" title="You are offline">
              <CloudOffIcon className="h-4 w-4" />
              Offline
            </span>
          ) : null}

          {isAuthenticated ? (
            <Link to={createPageUrl("Dashboard")} className="pr-icon-btn" aria-label="Notifications">
              <BellIcon className="h-5 w-5" />
            </Link>
          ) : null}

          <a href={DONATE_URL} {...DONATE_LINK_PROPS} className="pr-btn pr-btn-gold pr-btn-sm">
            Donate
          </a>

          {isAuthenticated ? (
            <div className="pr-header-user">
              <span className="pr-user-name">{user?.full_name || user?.email}</span>
              <button type="button" onClick={() => logout(true)} className="pr-icon-btn" aria-label="Sign out">
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to={createPageUrl("Login")} className="pr-btn pr-btn-primary pr-btn-sm">
              <LogInIcon className="h-4 w-4" />
              Get started
            </Link>
          )}

          <button
            type="button"
            className="pr-icon-btn pr-menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="pr-mobile-nav">
          <Link to={createPageUrl("Home")} className={linkClass("Home")}>
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link key={item.name} to={createPageUrl(item.name)} className={linkClass(item.name)}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {SECONDARY_ITEMS.map((item) => (
            <Link key={item.name} to={createPageUrl(item.name)} className={linkClass(item.name)}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}