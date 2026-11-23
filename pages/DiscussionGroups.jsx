import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCollection, submitThreadMessage } from "@/lib/contentApi";
import { DISCUSSION_GROUPS } from "@/lib/seedContent";
import { useAuth } from "@/lib/AuthContext";
import { safeText } from "@/lib/format";
import { STORAGE_KEYS } from "@/lib/theme";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import ThreadMessages from "@/components/community/ThreadMessages";
import { UsersIcon, CalendarDaysIcon, CheckCircleIcon, PlusIcon } from "lucide-react";

const readJoined = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.joinedGroups) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function DiscussionGroups() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const initialGroup = useMemo(() => new URLSearchParams(window.location.search).get("group") || "", []);
  const [selected, setSelected] = useState(initialGroup);
  const [joined, setJoined] = useState(readJoined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { data: groupRows, isLoading } = useQuery({
    queryKey: ["discussion-groups"],
    queryFn: () => fetchPublicCollection("groups")
  });

  const { data: threadRows } = useQuery({
    queryKey: ["discussion-threads"],
    queryFn: () => fetchPublicCollection("threads")
  });

  const groups = useMemo(() => {
    const live = groupRows || [];
    if (!live.length) return DISCUSSION_GROUPS.map((group, index) => ({ ...group, id: `seed-${index}` }));
    const merged = [...live];
    DISCUSSION_GROUPS.forEach((group, index) => {
      if (!merged.some((row) => safeText(row.name) === safeText(group.name))) {
        merged.push({ ...group, id: `seed-${index}` });
      }
    });
    return merged;
  }, [groupRows]);

  const messages = useMemo(() => {
    if (!selected) return [];
    return (threadRows || []).filter((row) => safeText(row.group_name) === safeText(selected));
  }, [threadRows, selected]);

  const messageMutation = useMutation({
    mutationFn: (payload) =>
      submitThreadMessage({
        ...payload,
        owner_email: user?.email || "",
        author_name: user?.full_name || "Reader"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["discussion-threads"] })
  });

  const selectGroup = (name) => {
    setSelected((current) => (current === name ? "" : name));
    setError("");
    const url = name
      ? `${window.location.pathname}?group=${encodeURIComponent(name)}`
      : window.location.pathname;
    window.history.replaceState({}, "", url);
  };

  const toggleJoin = (name) => {
    if (!isAuthenticated) return;
    setJoined((prev) => {
      const next = prev.includes(name) ? prev.filter((value) => value !== name) : [...prev, name];
      try {
        localStorage.setItem(STORAGE_KEYS.joinedGroups, JSON.stringify(next));
      } catch {
        // storage is unavailable; the join is only a visual marker anyway
      }
      return next;
    });
  };

  const handleSubmit = (text) => {
    setBusy(true);
    setError("");
    messageMutation.mutate(
      { group_name: selected, title: "", body: text },
      {
        onSuccess: () => setBusy(false),
        onError: (mutationError) => {
          setBusy(false);
          setError(mutationError?.message || "The message could not be posted.");
        }
      }
    );
  };

  const activeGroup = groups.find((group) => safeText(group.name) === safeText(selected));

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Community</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Discussion groups
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "62ch" }}>
            Study the same passage with other readers. One chapter a week, one honest question each.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        {isLoading ? (
          <Spinner label="Loading groups" />
        ) : groups.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No groups open yet"
            description="New study groups are announced here as they are formed."
          />
        ) : (
          <div className="pr-grid pr-grid-2">
            {groups.map((group) => {
              const name = safeText(group.name);
              const isSelected = selected === name;
              const hasJoined = joined.includes(name);
              return (
                <article
                  key={group.id}
                  className="pr-card pr-card-pad"
                  style={isSelected ? { borderColor: "var(--pr-gold)" } : undefined}
                >
                  <h2 className="pr-heading" style={{ margin: 0, fontSize: "1.12rem", fontWeight: 800 }}>
                    {name}
                  </h2>
                  <p style={{ margin: "10px 0 0", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {safeText(group.description)}
                  </p>
                  <div style={{ display: "grid", gap: 8, marginTop: 14, fontSize: "0.85rem" }}>
                    <span>
                      <CalendarDaysIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                      {safeText(group.schedule) || "Schedule to be announced"}
                    </span>
                    <span>
                      <UsersIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                      {Number(group.member_count || 0)} members
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="pr-btn pr-btn-primary pr-btn-sm"
                      onClick={() => selectGroup(name)}
                    >
                      {isSelected ? "Close group" : "Open group"}
                    </button>
                    <button
                      type="button"
                      className="pr-btn pr-btn-outline pr-btn-sm"
                      onClick={() => toggleJoin(name)}
                      disabled={!isAuthenticated}
                      title={isAuthenticated ? "" : "Sign in to join a group"}
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4" /> Joined
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4" /> Join
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {activeGroup ? (
          <ThreadMessages
            messages={messages}
            onSubmit={handleSubmit}
            isAuthenticated={isAuthenticated}
            busy={busy}
            error={error}
            groupName={safeText(activeGroup.name)}
          />
        ) : null}
      </div>
    </div>
  );
}