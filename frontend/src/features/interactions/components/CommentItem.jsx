import { useAuth } from "../../auth/auth.context";

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?.id === comment.author.id;

  return (
    <div className="d-flex justify-content-between small border-bottom py-1">
      <div>
        <b>{comment.author.fullName}</b>: {comment.content}
      </div>
      {isOwner && (
        <button
          className="btn btn-link btn-sm text-danger"
          onClick={() => onDelete(comment.id)}
        >
          Delete
        </button>
      )}
    </div>
  );
}
