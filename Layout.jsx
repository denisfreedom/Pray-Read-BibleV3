import React from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/themeContext";
import { PlayerProvider } from "@/lib/player";
import { BRAND_CSS } from "@/lib/brandCss";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import GlobalPlayer from "@/components/layout/GlobalPlayer";
import PwaHead from "@/components/layout/PwaHead";

export default function Layout({ children, currentPageName }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PlayerProvider>
          <div className="pr-page">
            <style>{BRAND_CSS}</style>
            <PwaHead />
            <AppHeader currentPageName={currentPageName} />
            <main className="pr-main">{children}</main>
            {currentPageName === "Home" ? <AppFooter /> : null}
            <GlobalPlayer />
          </div>
        </PlayerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}