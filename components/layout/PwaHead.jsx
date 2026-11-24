import React, { useEffect } from "react";
import { APPLE_ICON_URL, FAVICON_URL } from "@/lib/theme";

/**
 * Adds the PWA meta tags to the document head and registers the service
 * worker. Kept separate from Layout so the markup stays small.
 */
export default function PwaHead() {
  useEffect(() => {
    const head = document.head;

    const addMeta = (attrs) => {
      const existing = head.querySelector(`meta[name="${attrs.name}"]`);
      if (existing) return;
      const meta = document.createElement("meta");
      Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value));
      head.appendChild(meta);
    };

    addMeta({ name: "theme-color", content: "#1d4035" });
    addMeta({ name: "apple-mobile-web-app-capable", content: "yes" });
    addMeta({ name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" });
    addMeta({ name: "apple-mobile-web-app-title", content: "Pray-Read" });
    addMeta({ name: "mobile-web-app-capable", content: "yes" });
    addMeta({ name: "description", content: "Pray · Read · Listen  -  the Bible, devotionals and prayer in English and Luganda." });

    const addLink = (rel, href, type) => {
      const existing = Array.from(head.querySelectorAll(`link[rel="${rel}"]`));
      if (existing.length) {
        existing.forEach((link) => {
          link.setAttribute("href", href);
          if (type) link.setAttribute("type", type);
        });
        return;
      }
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (type) link.setAttribute("type", type);
      head.appendChild(link);
    };

    addLink("manifest", "/manifest.json");
    // The favicon the browser shows on the tab.
    addLink("icon", FAVICON_URL, "image/x-icon");
    addLink("shortcut icon", FAVICON_URL, "image/x-icon");
    addLink("apple-touch-icon", APPLE_ICON_URL, "image/png");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  return null;
}