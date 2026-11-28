import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { callAdmin } from "@/lib/adminSession";
import { newPasswordProblem, PASSWORD_RULE_TEXT } from "@/lib/adminPasswordRules";
import { Loader2Icon } from "lucide-react";

// Reset Admin Password: Option A changes the password when the current one is
// known. Option B points to the owner reset for a forgotten password.
export default function ResetAdminPasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (next !== confirm) {
      setStatus("error");
      setMessage("The two passwords are not the same.");
      return;
    }
    const problem = newPasswordProblem(current, next);
    if (problem) {
      setStatus("error");
      setMessage(problem);
      return;
    }
    setStatus("loading");
    try {
      await callAdmin("changePassword", { current, next });
      setStatus("success");
      setMessage("Password changed successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not change the password.");
    }
  };

  return (
    <div className="pr-card pr-card-pad">
      <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
        Reset Admin Password
      </h2>

      <h3 style={{ margin: "14px 0 6px", fontSize: "0.95rem", fontWeight: 700 }}>Option A: Change password</h3>
      <p style={{ margin: "0 0 12px", fontSize: "0.85rem" }}>{PASSWORD_RULE_TEXT}</p>
      <form onSubmit={submit}>
        <div className="pr-field">
          <label className="pr-label" htmlFor="current-password">Current password</label>
          <input id="current-password" className="pr-input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </div>
        <div className="pr-field">
          <label className="pr-label" htmlFor="new-password">New password</label>
          <input id="new-password" className="pr-input" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
        </div>
        <div className="pr-field">
          <label className="pr-label" htmlFor="confirm-password">Confirm new password</label>
          <input id="confirm-password" className="pr-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        </div>
        {message ? <div className={status === "success" ? "pr-success" : "pr-error"} style={{ marginBottom: 12 }}>{message}</div> : null}
        <button type="submit" className="pr-btn pr-btn-primary" disabled={status === "loading"}>
          {status === "loading" ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
          Change password
        </button>
      </form>

      <h3 style={{ margin: "22px 0 6px", fontSize: "0.95rem", fontWeight: 700 }}>Option B: Owner reset</h3>
      <p style={{ margin: "0 0 12px", fontSize: "0.85rem" }}>If you do not remember the old password, reset it with the Owner Reset Key.</p>
      <Link to={createPageUrl("AdminOwnerReset")} className="pr-link" style={{ fontSize: "0.88rem" }}>
        I forgot my old password  -  Use Owner Reset Key
      </Link>
    </div>
  );
}