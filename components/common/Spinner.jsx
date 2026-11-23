import React from "react";

export default function Spinner({ label = "Loading", className = "" }) {
  return (
    <div
      className={`pr-section ${className}`}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
      role="status"
      aria-live="polite"
    >
      <span className="pr-spinner" />
      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{label}</span>
    </div>
  );
}