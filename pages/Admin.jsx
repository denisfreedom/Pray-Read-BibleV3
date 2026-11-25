import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  adminResetPassword,
  adminSessionCheck,
  adminSignIn
} from "@/lib/adminSession";
import { Loader2Icon, ShieldCheckIcon, ArrowLeftIcon } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@prayread.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetKey, setResetKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("idle");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState(false);

  // An open session goes straight to the content manager, so the owner is
  // never asked for the password twice.
  useEffect(() => {
    adminSessionCheck()
      .then((state) => {
        if (state && state.valid) navigate(createPageUrl("AdminDashboard"));
      })
      .catch(() => {});
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await adminSignIn(email, password);
      if (!result || !result.ok) {
        setStatus("error");
        setErrorMsg(result?.error || "Could not sign you in.");
        return;
      }
      navigate(createPageUrl("AdminDashboard"));
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not sign you in.");
    }
  };

  const submitReset = async () => {
    setResetStatus("loading");
    setResetMessage("");
    setResetError(false);
    if (newPassword.length < 8) {
      setResetStatus("error");
      setResetError(true);
      setResetMessage("The new password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetStatus("error");
      setResetError(true);
      setResetMessage("The two passwords are not the same.");
      return;
    }
    try {
      const data = await adminResetPassword(email, resetKey, newPassword);
      if (data && data.error) {
        setResetStatus("error");
        setResetError(true);
        setResetMessage(data.error);
        return;
      }
      setResetStatus("success");
      setResetKey("");
      setNewPassword("");
      setConfirmPassword("");
      setResetMessage(`The password for ${email} has been set. Sign in with it now.`);
    } catch (err) {
      setResetStatus("error");
      setResetError(true);
      setResetMessage(err.message || "Could not set the password.");
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
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
          <h1 className="pr-heading" style={{ margin: "16px 0 0", fontSize: "1.4rem", fontWeight: 800 }}>
            Content manager
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
            This is the Pray-Read administration area. It is separate from reader accounts.
          </p>

          <form onSubmit={submit} style={{ marginTop: 20 }}>
            <div className="pr-field">
              <label className="pr-label" htmlFor="admin-email">
                Administrator email
              </label>
              <input
                id="admin-email"
                className="pr-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="pr-field">
              <label className="pr-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className="pr-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            {status === "error" ? <div className="pr-error">{errorMsg}</div> : null}

            <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" style={{ marginTop: 14 }} disabled={status === "loading"}>
              {status === "loading" ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
              {status === "loading" ? "Signing in…" : "Sign in to the admin area"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setResetOpen((value) => !value)}
            className="pr-link"
            style={{ marginTop: 14, fontSize: "0.85rem", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {resetOpen ? "Hide the password reset" : "Lost the password?"}
          </button>

          {resetOpen ? (
            <div style={{ marginTop: 14, padding: 16, borderRadius: 18, background: "rgba(29,64,53,0.05)", border: "1px solid var(--pr-border)" }}>
              <p style={{ margin: "0 0 12px", fontSize: "0.82rem", lineHeight: 1.6 }}>
                Set a new password for the administrator without the old one. This needs the owner key, which is kept
                in the environment settings of this app.
              </p>
              <div className="pr-field">
                <label className="pr-label" htmlFor="admin-reset-key">
                  Owner key
                </label>
                <input
                  id="admin-reset-key"
                  className="pr-input"
                  type="password"
                  value={resetKey}
                  onChange={(event) => setResetKey(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="admin-new-password">
                  New password
                </label>
                <input
                  id="admin-new-password"
                  className="pr-input"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="admin-confirm-password">
                  Confirm the new password
                </label>
                <input
                  id="admin-confirm-password"
                  className="pr-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {resetMessage ? (
                <div className={resetError ? "pr-error" : "pr-success"} style={{ marginBottom: 12 }}>
                  {resetMessage}
                </div>
              ) : null}

              <button
                type="button"
                className="pr-btn pr-btn-primary pr-btn-block"
                onClick={submitReset}
                disabled={resetStatus === "loading"}
              >
                {resetStatus === "loading" ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                {resetStatus === "loading" ? "Setting the password…" : "Set the new password"}
              </button>
            </div>
          ) : null}

          <hr className="pr-divider" />
          <Link to={createPageUrl("Home")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            <ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> Back to the site
          </Link>
        </div>
      </div>
    </div>
  );
}