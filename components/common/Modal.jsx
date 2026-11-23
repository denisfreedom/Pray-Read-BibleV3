import React, { useEffect } from "react";
import { XIcon } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, children, footer, width }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pr-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="pr-modal"
        style={width ? { maxWidth: width } : undefined}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="pr-modal-head">
          <button type="button" className="pr-modal-close" onClick={onClose} aria-label="Close">
            <XIcon className="h-4 w-4" />
          </button>
          {title ? (
            <h2 className="pr-serif" style={{ margin: 0, fontSize: "1.5rem", color: "#fff" }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.78)", fontSize: "0.85rem" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="pr-modal-body">{children}</div>
        {footer ? (
          <div style={{ padding: "0 24px 24px", display: "flex", gap: 10, flexWrap: "wrap" }}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}