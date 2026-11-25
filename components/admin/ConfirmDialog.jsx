import React from "react";
import { AlertTriangleIcon } from "lucide-react";

/**
 * A confirmation step before something is removed for good.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel
}) {
  if (!open) return null;
  return (
    <div className="pr-modal-backdrop" onClick={onCancel} role="presentation">
      <div
        className="pr-modal"
        style={{ maxWidth: 460 }}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pr-modal-body" style={{ paddingTop: 28 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                background: "rgba(159, 45, 45, 0.1)",
                color: "#9f2d2d"
              }}
            >
              <AlertTriangleIcon className="h-5 w-5" />
            </span>
            <div style={{ minWidth: 0 }}>
              <h3 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem" }}>
                {title}
              </h3>
              {message ? (
                <p className="pr-muted" style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6 }}>
                  {message}
                </p>
              ) : null}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 22,
              flexWrap: "wrap"
            }}
          >
            <button type="button" className="pr-btn pr-btn-outline" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="pr-btn pr-btn-danger" onClick={onConfirm} disabled={busy}>
              {busy ? "Working…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}