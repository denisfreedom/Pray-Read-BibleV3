import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { toISODate } from "@/lib/reading";
import JournalForm from "@/components/journal/JournalForm";
import JournalCard from "@/components/journal/JournalCard";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { NotebookIcon, PlusIcon, Trash2Icon } from "lucide-react";

const FILTERS = ["all", "praise", "petition", "confession", "thanksgiving", "reflection"];

export default function Journal() {
  const { user } = useAuth();
  const email = user?.email || null;
  const queryClient = useQueryClient();

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [showForm, setShowForm] = useState(params.get("new") === "1");
  const [draft, setDraft] = useState(() => ({
    book: params.get("book") || "",
    chapter: params.get("chapter") ? Number(params.get("chapter")) : null
  }));
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: journalRows, isLoading } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => fse2.entities.JournalEntry.list("-created_date", 200),
    enabled: !!email
  });

  const entries = useMemo(() => {
    if (!email) return [];
    const mine = (journalRows || []).filter((row) => row.owner_email === email);
    if (filter === "all") return mine;
    return mine.filter((row) => row.category === filter);
  }, [journalRows, email, filter]);

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      payload.id
        ? fse2.entities.JournalEntry.update(payload.id, payload.data)
        : fse2.entities.JournalEntry.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      setShowForm(false);
      setEditingId(null);
      setDraft({ book: "", chapter: null });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fse2.entities.JournalEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      setDeleteTarget(null);
    }
  });

  const handleSave = (values) => {
    if (!email) return;
    saveMutation.mutate({
      id: editingId,
      data: {
        owner_email: email,
        entry_date: toISODate(),
        title: values.title,
        body: values.body,
        category: values.category,
        book: values.book,
        chapter: values.chapter,
        mood: draft.mood || ""
      }
    });
  };

  const openEditor = (entry) => {
    setEditingId(entry.id);
    setDraft(entry);
    setShowForm(true);
  };

  const openBlank = () => {
    setEditingId(null);
    setDraft({ book: "", chapter: null });
    setShowForm(true);
  };

  if (isLoading) {
    return <Spinner label="Loading your journal" />;
  }

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Prayer journal</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            What is on your heart
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "56ch" }}>
            Praise, petitions, confessions and thanksgivings  -  written in your own words.
          </p>
          {email ? (
            <div className="pr-hero-actions">
              <button type="button" className="pr-btn pr-btn-gold" onClick={openBlank}>
                <PlusIcon className="h-4 w-4" />
                New entry
              </button>
            </div>
          ) : (
            <div className="pr-hero-actions">
              <Link to={createPageUrl("Login")} className="pr-btn pr-btn-gold">
                Sign in to write
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="pr-container pr-section">
        {showForm && email ? (
          <div style={{ marginBottom: 22 }}>
            <JournalForm
              initial={draft}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              saving={saveMutation.isPending}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`pr-chip ${filter === item ? "pr-tab-active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setFilter(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon={NotebookIcon}
            title={filter === "all" ? "Your journal is empty" : "Nothing in this category yet"}
            description="Read a chapter in the reader, then open the prayer journal to start an entry."
            action={
              email ? (
                <button type="button" className="pr-btn pr-btn-primary" onClick={openBlank}>
                  <PlusIcon className="h-4 w-4" />
                  Write an entry
                </button>
              ) : null
            }
          />
        ) : (
          <div className="pr-grid pr-grid-2">
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} onEdit={openEditor} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      {deleteTarget ? (
        <div className="pr-modal-backdrop" onClick={() => setDeleteTarget(null)} role="presentation">
          <div
            className="pr-modal"
            style={{ maxWidth: 420 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="pr-modal-body">
              <h3 className="pr-heading" style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                Delete this entry?
              </h3>
              <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>
                “{deleteTarget.title || "Untitled entry"}” will be removed permanently.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  className="pr-btn pr-btn-danger"
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                >
                  <Trash2Icon className="h-4 w-4" />
                  Delete
                </button>
                <button type="button" className="pr-btn pr-btn-outline" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}