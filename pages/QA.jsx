import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCollection, submitQuestion } from "@/lib/contentApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { QA_ENTRIES } from "@/lib/seedContent";
import EmptyState from "@/components/common/EmptyState";
import { MessageCircleQuestionIcon, Loader2Icon, CheckCircleIcon, SendIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function QA() {
  const { user, isAuthenticated } = useAuth();
  const email = user?.email || null;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: rows } = useQuery({
    queryKey: ["qaEntries"],
    queryFn: () => fetchPublicCollection("qa", { authenticated: isAuthenticated })
  });

  const askMutation = useMutation({
    mutationFn: (payload) => submitQuestion(payload),
    onSuccess: () => {
      setStatus("success");
      setQuestion("");
      queryClient.invalidateQueries({ queryKey: ["qaEntries"] });
    },
    onError: (err) => {
      setStatus("error");
      setErrorMsg(err.message || "Could not send your question. Please try again.");
    }
  });

  const entries = useMemo(() => {
    if (rows && rows.length) return rows;
    return QA_ENTRIES;
  }, [rows]);

  const categories = useMemo(() => {
    const set = new Set(entries.map((item) => item.category).filter(Boolean));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchSearch =
        !query ||
        String(item.question || "").toLowerCase().includes(query) ||
        String(item.answer || "").toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [entries, search, category]);

  const submit = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (!question.trim()) {
      setStatus("error");
      setErrorMsg("Type your question first.");
      return;
    }
    setStatus("loading");
    askMutation.mutate({
      question: question.trim(),
      category: category === "all" ? "General" : category,
      status: "pending",
      author_email: email
    });
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Q&A</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Ask anything about the faith
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "60ch" }}>
            Real questions from readers, answered with a passage you can read for yourself.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid" style={{ gridTemplateColumns: "1fr", gap: 24 }}>
          <div className="pr-card pr-card-pad">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <input
                className="pr-input"
                style={{ flex: "1 1 240px" }}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions…"
                aria-label="Search questions"
              />
              <div className="pr-tabs" style={{ borderBottom: "none" }}>
                <button
                  type="button"
                  className={`pr-tab ${category === "all" ? "pr-tab-active" : ""}`}
                  onClick={() => setCategory("all")}
                >
                  All
                </button>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`pr-tab ${category === item ? "pr-tab-active" : ""}`}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={MessageCircleQuestionIcon}
              title="No question matches that search"
              description="Try a different word, or ask your own question below."
            />
          ) : (
            <div className="pr-grid pr-grid-2">
              {filtered.map((item) => (
                <div key={item.id || item.question} className="pr-card pr-card-pad">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="pr-badge pr-badge-outline">{item.category || "General"}</span>
                    {item.status === "answered" ? (
                      <span className="pr-badge pr-badge-emerald">
                        <CheckCircleIcon className="h-3 w-3" /> Answered
                      </span>
                    ) : (
                      <span className="pr-badge pr-badge-gold">Awaiting answer</span>
                    )}
                  </div>

                  <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.08rem", fontWeight: 800 }}>
                    {item.question}
                  </h2>

                  {item.answer ? (
                    <p style={{ margin: "12px 0 0", fontSize: "0.94rem" }}>{item.answer}</p>
                  ) : (
                    <p style={{ margin: "12px 0 0", fontSize: "0.9rem" }}>
                      Our pastoral team is working on this one. We will publish the answer shortly.
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
                    {item.passage_ref ? (
                      <Link
                        to={createPageUrl("Chapter") + "?book=19&chapter=23"}
                        className="pr-link"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {item.passage_ref} →
                      </Link>
                    ) : null}
                    <Link
                      to={createPageUrl("TheologicalInsights")}
                      className="pr-link"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Insights →
                    </Link>
                    {item.answered_by ? (
                      <span style={{ fontSize: "0.78rem" }}>{item.answered_by}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>
              Ask a question
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>
              {isAuthenticated
                ? "Your question goes to the pastoral team. We answer in the app and link the passage."
                : "Sign in to ask a question. You can still read every answer below."}
            </p>

            {status === "success" ? (
              <div className="pr-success" style={{ marginTop: 14 }}>
                Thank you. Your question has been sent to the pastoral team.
              </div>
            ) : (
              <form onSubmit={submit} style={{ marginTop: 14 }}>
                <div className="pr-field">
                  <label className="pr-label" htmlFor="question">
                    Your question
                  </label>
                  <textarea
                    id="question"
                    className="pr-textarea"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="How do I know if my prayer life is growing?"
                    disabled={!isAuthenticated}
                  />
                </div>
                {status === "error" ? <div className="pr-error">{errorMsg}</div> : null}
                <button
                  type="submit"
                  className="pr-btn pr-btn-primary"
                  style={{ marginTop: 12 }}
                  disabled={status === "loading" || !isAuthenticated}
                >
                  {status === "loading" ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendIcon className="h-4 w-4" />
                  )}
                  {status === "loading" ? "Sending…" : "Send my question"}
                </button>
                {!isAuthenticated ? (
                  <p style={{ margin: "12px 0 0", fontSize: "0.82rem" }}>
                    <Link to={createPageUrl("Login")} className="pr-link">
                      Sign in
                    </Link>{" "}
                    to send a question.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}