import { useMemo, useState } from "react";
import { useAuth } from "../../auth/auth.context";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

export default function PostCard({ post, onUpdated, onRemoved }) {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);

  const isOwner = useMemo(() => {
    const authorId = post.author?.id || post.authorId;
    return user?.id && authorId === user.id;
  }, [post, user]);

  return (
    <div className={`card shadow-sm border-0 ${post._optimistic ? "opacity-75" : ""}`}>
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
              <div className="fw-semibold">{post.author?.fullName || "Unknown"}</div>
              <div className="text-muted small">
                {new Date(post.createdAt).toLocaleString()}
                {post._optimistic ? " • posting..." : ""}
              </div>
            </div>
          </div>

          {isOwner && !post._optimistic && (
            <div className="btn-group">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowEdit(true)}>
                Edit
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDel(true)}>
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
      </div>

      <EditPostModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        post={post}
        onUpdated={(updatedPost) => onUpdated?.(post.id, updatedPost)}
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
