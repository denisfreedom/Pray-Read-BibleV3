import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { callAdmin, getAdminToken, setAdminToken } from "@/lib/adminSession";
import { Loader2Icon, ShieldCheckIcon, ArrowLeftIcon } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@prayread.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    callAdmin("session")
      .then((data) => {
        if (data && data.valid) navigate(createPageUrl("AdminDashboard"));
      })
      .catch(() => {});
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await callAdmin("login", { email, password });
      if (!data || data.error) {
        setStatus("error");
        setErrorMsg(data?.error || "Could not sign you in.");
        return;
      }
      setAdminToken(data.token);
      navigate(createPageUrl("AdminDashboard"));
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not sign you in.");
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

          <hr className="pr-divider" />
          <Link to={createPageUrl("Home")} className="pr-link" style={{ fontSize: "0.85rem" }}>
            <ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> Back to the site
          </Link>
        </div>
      </div>
    </div>
  );
}