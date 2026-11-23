import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { Loader2Icon, ArrowRightIcon, LogInIcon } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fse2.auth.login(email, password);
      navigate(createPageUrl("Dashboard"));
    } catch (err) {
      setError(err.message || "Could not sign you in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 20px" }}>
      <div className="pr-container" style={{ maxWidth: 460 }}>
        <div className="pr-card pr-card-pad">
          <span className="pr-eyebrow">Welcome back</span>
          <h1 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
            Sign in to Pray-Read
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
            Your chapters, highlights, notes and prayers follow you across devices.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div className="pr-field">
              <label className="pr-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="pr-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="pr-field">
              <label className="pr-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="pr-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? <div className="pr-error">{error}</div> : null}

            <button type="submit" className="pr-btn pr-btn-primary pr-btn-block" style={{ marginTop: 14 }} disabled={loading}>
              {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <LogInIcon className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <Link to={createPageUrl("ForgotPassword")} className="pr-link" style={{ fontSize: "0.85rem" }}>
              Forgot your password?
            </Link>
            <Link to={createPageUrl("Signup")} className="pr-link" style={{ fontSize: "0.85rem" }}>
              Create an account
            </Link>
          </div>

          <hr className="pr-divider" />
          <Link to={createPageUrl("BibleReader")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            Continue without signing in <ArrowRightIcon className="h-4 w-4" style={{ display: "inline" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}