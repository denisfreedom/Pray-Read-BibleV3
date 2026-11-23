import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/contentApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeftIcon, CheckCircleIcon, Loader2Icon, SendIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const send = useMutation({
    mutationFn: (payload) => submitContactMessage(payload),
    onSuccess: () => setStatus("success"),
    onError: (err) => {
      setStatus("error");
      setErrorMsg(err.message || "Could not send your message. Please try again.");
    }
  });

  const submit = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Please add your name, email and message.");
      return;
    }
    if (!form.email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    send.mutate({ ...form, is_read: false });
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Contact us
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "56ch" }}>
            Pray-Read is run by a small team. We read every message.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ maxWidth: 620 }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircleIcon className="h-12 w-12" style={{ color: "var(--pr-emerald)", margin: "0 auto" }} />
              <h2 className="pr-heading" style={{ margin: "16px 0 0", fontSize: "1.3rem", fontWeight: 800 }}>
                Message sent
              </h2>
              <p style={{ margin: "10px 0 0" }}>
                Thank you for writing. We will reply to your email address as soon as we can.
              </p>
              <button
                type="button"
                className="pr-btn pr-btn-outline pr-btn-sm"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setForm({ name: "", email: "", subject: "", message: "" });
                  setStatus("idle");
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="pr-field">
                <label className="pr-label" htmlFor="contact-name">
                  Your name
                </label>
                <input
                  id="contact-name"
                  className="pr-input"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="contact-email">
                  Your email
                </label>
                <input
                  id="contact-email"
                  className="pr-input"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="contact-subject">
                  Subject (optional)
                </label>
                <input
                  id="contact-subject"
                  className="pr-input"
                  value={form.subject}
                  onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                />
              </div>
              <div className="pr-field">
                <label className="pr-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="pr-textarea"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                />
              </div>

              {status === "error" ? <div className="pr-error">{errorMsg}</div> : null}

              <button type="submit" className="pr-btn pr-btn-primary" style={{ marginTop: 6 }} disabled={status === "loading"}>
                {status === "loading" ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                {status === "loading" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}