import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="pr-empty">
      {Icon ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 18,
            background: "var(--pr-ivory-soft)",
            color: "var(--pr-gold-deep)",
            marginBottom: 14
          }}
        >
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <h3 className="pr-heading" style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
        {title}
      </h3>
      {description ? (
        <p style={{ margin: "10px auto 0", maxWidth: "46ch", fontSize: "0.9rem" }}>{description}</p>
      ) : null}
      {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
    </div>
  );
}