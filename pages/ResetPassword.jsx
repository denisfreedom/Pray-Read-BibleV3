import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { Loader2Icon, CheckCircleIcon, KeyRoundIcon } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || params.get("access_token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) setStatus("error");
  }, [token]);

  const submit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (password.length < 8) {
      setStatus("error");
      setErrorMsg("Your new password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setErrorMsg("The password and the confirmation do not match.");
      return;
    }
    setStatus("loading");
    try {
      await fse2.auth.resetPassword(token, password);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not reset the password.");
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div className="pr-container" style={{ maxWidth: 460 }}>
        <div className="pr-card pr-card-pad">
          <span className="pr-eyebrow">Account recovery</span>
          <h1 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
            Choose a new password
          </h1>

          {status === "done" ? (
            <>
              <div className="pr-success" style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircleIcon className="h-5 w-5" />
                <span>Your password has been changed. You can sign in with it now.</span>
              </div>
              <button
                type="button"
                className="pr-btn pr-btn-primary pr-btn-block"
                style={{ marginTop: 16 }}
                onClick={() => navigate(createPageUrl("Login"))}
              >
                Go to sign in
              </button>
            </>
          ) : (
            <form onSubmit={submit} style={{ marginTop: 20 }}>
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

              {status === "error" ? (
                <div className="pr-error">
                  {errorMsg ||
                    "This reset link is missing or has expired. Request a new one from the forgot-password page."}
                </div>
              ) : null}

              <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" style={{ marginTop: 6 }} disabled={status === "loading" || !token}>
                {status === "loading" ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRoundIcon className="h-4 w-4" />
                )}
                {status === "loading" ? "Saving…" : "Set new password"}
              </button>
            </form>
          )}

          <hr className="pr-divider" />
          <Link to={createPageUrl("Login")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}