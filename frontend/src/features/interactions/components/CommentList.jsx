import CommentItem from "./CommentItem";

export default function CommentList({ comments, onDelete }) {
  return (
    <div className="mt-2">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onDelete={onDelete} />
      ))}
    </div>
  );
}
