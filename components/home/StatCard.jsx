import React from "react";

export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="pr-stat">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {Icon ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(29,64,53,0.09)",
              color: "var(--pr-emerald)"
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--pr-body)" }}>{label}</p>
      </div>
      <p className="pr-stat-value">{value}</p>
      {hint ? <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>{hint}</p> : null}
    </div>
  );
}