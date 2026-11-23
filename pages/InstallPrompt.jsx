import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { APPLE_ICON_URL } from "@/lib/theme";
import { AppleIcon, ChromeIcon, SmartphoneIcon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState("other");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setInstalled(Boolean(isStandalone));

    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
    else if (/Macintosh|Windows|Linux/i.test(ua)) setPlatform("desktop");

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Install Pray-Read Bible
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "58ch" }}>
            One codebase, three platforms: web, Android and iOS. Installed, the app opens like any other and keeps
            working in flight mode.
          </p>
          <img
            src={APPLE_ICON_URL}
            alt=""
            style={{ display: "none" }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </section>

      <div className="pr-container pr-section">
        {installed ? (
          <div className="pr-success" style={{ marginBottom: 22 }}>
            <CheckCircleIcon className="h-4 w-4" style={{ display: "inline" }} /> Pray-Read is installed on this
            device. Open it from your home screen.
          </div>
        ) : null}

        <div className="pr-grid pr-grid-2">
          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <ChromeIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Android &amp; Chrome
            </h2>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: "0.9rem", lineHeight: 1.9 }}>
              <li>Open Pray-Read in Chrome.</li>
              <li>Tap the menu (three dots) in the top right.</li>
              <li>Choose “Add to Home screen” or “Install app”.</li>
              <li>Tap Install. The icon appears on your home screen.</li>
            </ol>
            {deferred ? (
              <button type="button" className="pr-btn pr-btn-primary" style={{ marginTop: 16 }} onClick={install}>
                <SmartphoneIcon className="h-4 w-4" />
                Install now
              </button>
            ) : null}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <AppleIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> iPhone &amp; iPad
            </h2>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: "0.9rem", lineHeight: 1.9 }}>
              <li>Open Pray-Read in Safari.</li>
              <li>Tap the Share button (the square with an arrow).</li>
              <li>Scroll down and tap “Add to Home Screen”.</li>
              <li>Tap Add. Launch it from your home screen for the full app view.</li>
            </ol>
          </div>
        </div>

        <div className="pr-card pr-card-pad" style={{ marginTop: 20 }}>
          <h2 className="pr-heading" style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 800 }}>
            What you get after installing
          </h2>
          <ul className="pr-list-reset" style={{ display: "grid", gap: 8, fontSize: "0.9rem" }}>
            <li>· Fast launch from the home screen, with the ivory and emerald brand colours.</li>
            <li>· The Bible, devotionals, prayers and commentary available offline.</li>
            <li>· The verse-song player that keeps playing while you browse.</li>
            <li>· No app-store account needed. Sign in with the same email you use here.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}