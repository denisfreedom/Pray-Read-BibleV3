import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { BRAND } from "@/lib/theme";


const ThemeContext = createContext(null);

const DEFAULTS = {
  ivory: BRAND.ivory,
  emerald: BRAND.emerald,
  gold: BRAND.gold,
  site_name: BRAND.siteName || "Pray-Read Bible",
  donate_url: "https://store.pesapal.com/donatetoprayreadbibleproject"
};

const toHex = (value) => {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
  if (/^#[0-9a-fA-F]{3}$/.test(text)) {
    return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`;
  }
  return null;
};

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return undefined;
    fetchPublicCollection("settings", { authenticated: true })
      .then((rows) => {
        if (!active || !rows || !rows.length) return;
        const next = { ...DEFAULTS };
        rows.forEach((row) => {
          if (row && row.setting_key) next[row.setting_key] = row.setting_value;
        });
        setSettings(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const root = document.documentElement;
    const ivory = toHex(settings.ivory) || DEFAULTS.ivory;
    const emerald = toHex(settings.emerald) || DEFAULTS.emerald;
    const gold = toHex(settings.gold) || DEFAULTS.gold;
    root.style.setProperty("--pr-ivory", ivory);
    root.style.setProperty("--pr-ivory-soft", ivory);
    root.style.setProperty("--pr-emerald", emerald);
    root.style.setProperty("--pr-emerald-deep", emerald);
    root.style.setProperty("--pr-gold", gold);
    root.style.setProperty("--pr-gold-soft", `${gold}26`);
  }, [settings]);

  const value = useMemo(() => ({ settings, setSettings, defaults: DEFAULTS }), [settings]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};