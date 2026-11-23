import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { Loader2Icon } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      logout(false);
      navigate(createPageUrl("Home"), { replace: true });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="pr-container pr-section" style={{ textAlign: "center" }}>
      <Loader2Icon className="h-6 w-6 animate-spin" style={{ color: "var(--pr-gold-deep)", margin: "0 auto" }} />
      <p style={{ marginTop: 14, fontWeight: 700, color: "var(--pr-heading)" }}>Signing you out…</p>
    </div>
  );
}