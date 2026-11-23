import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { Loader2Icon, MailCheckIcon, ArrowLeftIcon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter the email address on your account.");
      return;
    }
    setStatus("loading");
    try {
      await fse2.auth.forgotPassword(email.trim());
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not send the reset email. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div className="pr-container" style={{ maxWidth: 460 }}>
        <div className="pr-card pr-card-pad">
          <span className="pr-eyebrow">Account recovery</span>
          <h1 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
            Reset your password
          </h1>

          {status === "sent" ? (
            <div className="pr-success" style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <MailCheckIcon className="h-5 w-5" />
              <span>
                If that address has an account, a reset link is on its way. Open it on this device to choose a new
                password.
              </span>
            </div>
          ) : (
            <form onSubmit={submit} style={{ marginTop: 20 }}>
              <p style={{ margin: "0 0 14px", fontSize: "0.9rem" }}>
                Enter your email address and we will send you a link to choose a new password.
              </p>
              <div className="pr-field">
                <label className="pr-label" htmlFor="forgot-email">
                  Email
                </label>
                <input
                  id="forgot-email"
                  className="pr-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {status === "error" ? <div className="pr-error">{errorMsg}</div> : null}
              <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" style={{ marginTop: 6 }} disabled={status === "loading"}>
                {status === "loading" ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                {status === "loading" ? "Sending…" : "Send the reset link"}
              </button>
            </form>
          )}

          <hr className="pr-divider" />
          <Link to={createPageUrl("Login")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            <ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}