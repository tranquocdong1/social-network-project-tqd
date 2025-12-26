import { useState } from "react";
import { useAuth } from "../../auth/auth.context";

import ReplyButton from "../reply/components/ReplyButton";
import ReplyBox from "../reply/components/ReplyBox";
import ReplyList from "../reply/components/ReplyList";
import useReplies from "../reply/hooks/useReplies";
import CommentLikeButton from "../comment-like/components/CommentLikeButton";

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?.id === comment.author.id;

  const [showReplies, setShowReplies] = useState(false);

  const {
    replies,
    loadReplies,
    addReply,
    loading,
    submitting,
    error,
  } = useReplies(comment.id);

  return (
    <div className="small border-bottom py-1">
      <div className="d-flex justify-content-between">
        <div>
          <b>{comment.author.fullName}</b>: {comment.content}
        </div>

        {isOwner && (
          <button
            className="btn btn-link btn-sm text-danger p-0"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-1 d-flex gap-3 align-items-center">
        <CommentLikeButton comment={comment} />

        <ReplyButton
          onClick={() => {
            setShowReplies((v) => !v);
            loadReplies();
          }}
        />
      </div>

      {showReplies && (
        <div className="ms-4 mt-2">
          <ReplyBox onSubmit={addReply} loading={submitting} />

          {loading && (
            <div className="text-muted small mt-1">
              Loading replies...
            </div>
          )}

          {error && (
            <div className="text-danger small mt-1">{error}</div>
          )}

          <ReplyList replies={replies} />
        </div>
      )}
    </div>
  );
}
