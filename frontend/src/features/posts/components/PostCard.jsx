import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/auth.context";

import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

import LikeButton from "../../interactions/components/LikeButton";
import CommentBox from "../../interactions/components/CommentBox";
import CommentList from "../../interactions/components/CommentList";
import useComments from "../../interactions/hooks/useComments";

export default function PostCard({ post: initialPost, onUpdated, onRemoved }) {
  const { user } = useAuth();

  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isOwner = useMemo(() => {
    const authorId = post.author?.id || post.authorId;
    return user?.id && authorId === user.id;
  }, [post, user]);

  const {
    items: comments,
    add,
    remove,
    loading,
    loadingMore,
    loadMore,
  } = useComments(post.id);

  return (
    <div
      className={`card shadow-sm border-0 ${
        post._optimistic ? "opacity-75" : ""
      }`}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex gap-2">
            <img
              src={post.author?.avatar || "https://via.placeholder.com/40"}
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle border"
            />
            <div>
              <div className="fw-semibold">
                {post.author?.fullName || "Unknown"}
              </div>
              <div className="text-muted small">
                {new Date(post.createdAt).toLocaleString()}
                {post._optimistic ? " • posting..." : ""}
              </div>
            </div>
          </div>

          {isOwner && !post._optimistic && (
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowDel(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {post.content && <p className="mt-3 mb-2">{post.content}</p>}

        {post.images?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-2">
            {post.images.map((url) => (
              <img
                key={url}
                src={url}
                alt="post"
                style={{ width: 120, height: 120, objectFit: "cover" }}
                className="rounded border"
              />
            ))}
          </div>
        )}

        {!post._optimistic && (
          <div className="d-flex align-items-center gap-3 mt-3">
            <LikeButton
              post={post}
              onLikeCountChange={(updater) =>
                setPost((p) => ({
                  ...p,
                  likeCount:
                    typeof updater === "function"
                      ? updater(p.likeCount || 0)
                      : updater,
                }))
              }
            />

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowComments((v) => !v)}
            >
              💬 {post.commentCount ?? comments.length}
            </button>
          </div>
        )}

        {showComments && !post._optimistic && (
          <div className="mt-3">
            <CommentBox
              onSubmit={async (text) => {
                await add(text);
                setPost((p) => ({
                  ...p,
                  commentCount: (p.commentCount || 0) + 1,
                }));
              }}
            />

            {loading && (
              <div className="text-muted small mt-2">
                Loading comments...
              </div>
            )}

            <CommentList
              comments={comments}
              onDelete={async (commentId) => {
                await remove(commentId);
                setPost((p) => ({
                  ...p,
                  commentCount: Math.max(0, (p.commentCount || 1) - 1),
                }));
              }}
            />

            {loadingMore && (
              <div className="text-muted small mt-2">
                Loading more...
              </div>
            )}

            {comments.length > 0 && (
              <button
                className="btn btn-link btn-sm text-decoration-none"
                onClick={loadMore}
              >
                Load more comments
              </button>
            )}
          </div>
        )}
      </div>

      <EditPostModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        post={post}
        onUpdated={(updatedPost) =>
          onUpdated?.(post.id, updatedPost)
        }
      />

      <DeletePostModal
        show={showDel}
        onClose={() => setShowDel(false)}
        postId={post.id}
        onDeleted={() => onRemoved?.(post.id)}
      />
    </div>
  );
}
