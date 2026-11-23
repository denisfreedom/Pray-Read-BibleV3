import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCollection, likeRevelation, submitComment, submitRevelation } from "@/lib/contentApi";
import { COMMUNITY_POSTS } from "@/lib/seedContent";
import { useAuth } from "@/lib/AuthContext";
import { safeText } from "@/lib/format";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import RevelationCard from "@/components/community/RevelationCard";
import RevelationForm from "@/components/community/RevelationForm";
import CommentThread from "@/components/community/CommentThread";
import { LightbulbIcon } from "lucide-react";

export default function CommunityRevelations() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [localLikes, setLocalLikes] = useState({});
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentError, setCommentError] = useState("");

  const { data: rows, isLoading } = useQuery({
    queryKey: ["revelations"],
    queryFn: () => fetchPublicCollection("revelations", { authenticated: isAuthenticated })
  });

  const livePosts = useMemo(() => (rows || []).filter((row) => !row.parent_id), [rows]);
  const liveComments = useMemo(() => (rows || []).filter((row) => row.parent_id), [rows]);

  const posts = useMemo(() => {
    const merged = [...livePosts];
    COMMUNITY_POSTS.forEach((post, index) => {
      if (!merged.some((row) => safeText(row.title) === safeText(post.title))) {
        merged.push({ ...post, id: `seed-${index}`, seed: true });
      }
    });
    return merged;
  }, [livePosts]);

  const likeMutation = useMutation({
    mutationFn: (id) => likeRevelation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revelations"] })
  });

  const postMutation = useMutation({
    mutationFn: (payload) =>
      submitRevelation({
        ...payload,
        owner_email: user?.email || "",
        author_name: user?.full_name || "Reader"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revelations"] })
  });

  const commentMutation = useMutation({
    mutationFn: ({ parentId, text }) =>
      submitComment({
        parent_id: parentId,
        title: "Comment",
        body: text,
        owner_email: user?.email || "",
        author_name: user?.full_name || "Reader"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revelations"] })
  });

  const handleLike = (post) => {
    if (post.seed) {
      setLocalLikes((prev) => ({ ...prev, [post.id]: (prev[post.id] || 0) + 1 }));
      return;
    }
    setLikingId(post.id);
    likeMutation.mutate(post.id, {
      onSettled: () => setLikingId(null)
    });
  };

  const handleComment = (parentId, text) => {
    setCommentBusy(true);
    setCommentError("");
    commentMutation.mutate(
      { parentId, text },
      {
        onSuccess: () => setCommentBusy(false),
        onError: (error) => {
          setCommentBusy(false);
          setCommentError(error?.message || "The comment could not be posted.");
        }
      }
    );
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Community</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Revelations
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "62ch" }}>
            What God is showing you, in your own words. Read one, like one, and add your own word of encouragement.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div style={{ display: "grid", gap: 22 }}>
          <RevelationForm
            onSubmit={(payload) => postMutation.mutate(payload)}
            isAuthenticated={isAuthenticated}
            status={postMutation.isPending ? "loading" : postMutation.isSuccess ? "success" : "idle"}
            error={postMutation.isError ? postMutation.error?.message || "The post could not be shared." : ""}
          />

          {isLoading ? (
            <Spinner label="Loading revelations" />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={LightbulbIcon}
              title="No revelations yet"
              description="Be the first to share what God showed you this week."
            />
          ) : (
            posts.map((post) => {
              const comments = liveComments.filter((comment) => comment.parent_id === post.id);
              const isOpen = openId === post.id;
              return (
                <div key={post.id}>
                  <RevelationCard
                    post={{ ...post, likes: Number(post.likes || 0) + (localLikes[post.id] || 0) }}
                    onLike={handleLike}
                    liking={likingId === post.id}
                    commentCount={comments.length}
                    commentsOpen={isOpen}
                    onToggleComments={(id) => {
                      setOpenId((current) => (current === id ? null : id));
                      setCommentError("");
                    }}
                  />
                  {isOpen ? (
                    <CommentThread
                      comments={comments}
                      onSubmit={(text) => handleComment(post.id, text)}
                      isAuthenticated={isAuthenticated}
                      busy={commentBusy}
                      error={commentError}
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}