import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { Loader2Icon, ArrowRightIcon, MailCheckIcon } from "lucide-react";

const strengthOf = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The password and the confirmation do not match.");
      return;
    }
    if (!terms) {
      setError("Please accept the terms of use to continue.");
      return;
    }

    setLoading(true);
    try {
      const result = await fse2.auth.register(email, password, fullName);
      if (result && result.verification_required) {
        setVerificationSent(true);
        return;
      }
      navigate(createPageUrl("Dashboard"));
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  const score = strengthOf(password);

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div className="pr-container" style={{ maxWidth: 500 }}>
        <div className="pr-card pr-card-pad">
          <span className="pr-eyebrow">Get started</span>
          <h1 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
            Create your Pray-Read account
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
            Keep your reading streak, highlights, notes and prayer journal together.
          </p>

          {verificationSent ? (
            <div className="pr-success" style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <MailCheckIcon className="h-5 w-5" />
              <span>
                Almost there  -  check your inbox and confirm your email address to finish setting up your account.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
              <div className="pr-field">
                <label className="pr-label" htmlFor="signup-name">
                  Full name
                </label>
                <input
                  id="signup-name"
                  className="pr-input"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="signup-email">
                  Email
                </label>
                <input
                  id="signup-email"
                  className="pr-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  className="pr-input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                {password ? (
                  <p style={{ margin: "6px 0 0", fontSize: "0.78rem", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
                    {STRENGTH_LABELS[score]} · at least 8 characters
                  </p>
                ) : (
                  <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>Use at least 8 characters.</p>
                )}
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="signup-confirm">
                  Confirm password
                </label>
                <input
                  id="signup-confirm"
                  className="pr-input"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.85rem", marginBottom: 12 }}>
                <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} style={{ marginTop: 3 }} />
                <span>
                  I agree to the{" "}
                  <Link to={createPageUrl("Terms")} className="pr-link">
                    terms of use
                  </Link>{" "}
                  and the{" "}
                  <Link to={createPageUrl("Privacy")} className="pr-link">
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

              {error ? <div className="pr-error">{error}</div> : null}

              <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" style={{ marginTop: 6 }} disabled={loading}>
                {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Creating your account…" : "Create account"}
              </button>
            </form>
          )}

          <hr className="pr-divider" />
          <p style={{ margin: 0, fontSize: "0.85rem" }}>
            Already have an account?{" "}
            <Link to={createPageUrl("Login")} className="pr-link">
              Sign in
            </Link>{" "}
            <ArrowRightIcon className="h-4 w-4" style={{ display: "inline" }} />
          </p>
        </div>
      </div>
    </div>
  );
}