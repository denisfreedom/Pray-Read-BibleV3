import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { adminResetPassword } from "@/lib/adminSession";
import { newPasswordProblem, PASSWORD_RULE_TEXT } from "@/lib/adminPasswordRules";
import { Loader2Icon, KeyRoundIcon, ArrowLeftIcon } from "lucide-react";

// The owner reset: sets a new administrator password with the owner reset key,
// without the old password. Works while logged out.
export default function AdminOwnerReset() {
  const [email, setEmail] = useState("admin@prayreadbible.com");
  const [resetKey, setResetKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setStatus("error");
      setMessage("The two passwords are not the same.");
      return;
    }
    const problem = newPasswordProblem("", password);
    if (problem) {
      setStatus("error");
      setMessage(problem);
      return;
    }
    setStatus("loading");
    try {
      await adminResetPassword(email.trim().toLowerCase(), resetKey.trim(), password);
      setStatus("success");
      setMessage("Password reset successfully. You can now log in.");
      setResetKey("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Invalid Owner Reset Key.");
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div className="pr-container" style={{ maxWidth: 460 }}>
        <div className="pr-card pr-card-pad">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 16,
              background: "rgba(29,64,53,0.09)",
              color: "var(--pr-emerald)"
            }}
          >
            <KeyRoundIcon className="h-6 w-6" />
          </span>
          <h1 className="pr-heading" style={{ margin: "16px 0 0", fontSize: "1.4rem", fontWeight: 800 }}>
            Owner reset
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
            Set a new administrator password with the Owner Reset Key. The old password is not needed.
          </p>

          <form onSubmit={submit} style={{ marginTop: 20 }}>
            <div className="pr-field">
              <label className="pr-label" htmlFor="reset-email">
                Admin email
              </label>
              <input
                id="reset-email"
                className="pr-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="pr-field">
              <label className="pr-label" htmlFor="reset-key">
                Owner Reset Key
              </label>
              <input
                id="reset-key"
                className="pr-input"
                type="password"
                value={resetKey}
                onChange={(event) => setResetKey(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="pr-field">
              <label className="pr-label" htmlFor="reset-password">
                New password
              </label>
              <input
                id="reset-password"
                className="pr-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
              <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>{PASSWORD_RULE_TEXT}</p>
            </div>
            <div className="pr-field">
              <label className="pr-label" htmlFor="reset-confirm">
                Confirm new password
              </label>
              <input
                id="reset-confirm"
                className="pr-input"
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {message ? (
              <div className={status === "success" ? "pr-success" : "pr-error"} style={{ marginBottom: 12 }}>
                {message}
              </div>
            ) : null}

            <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" disabled={status === "loading"}>
              {status === "loading" ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
              {status === "loading" ? "Resetting…" : "Reset password"}
            </button>
          </form>

          <hr className="pr-divider" />
          <Link to={createPageUrl("Admin")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            <ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> Back to admin login
          </Link>
        </div>
      </div>
    </div>
  );
}