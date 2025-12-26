import useCommentLike from "../hooks/useCommentLike";

export default function CommentLikeButton({ comment }) {
  const {
    liked,
    likeCount,
    toggleLike,
    loading,
    checking,
  } = useCommentLike(comment);

  if (checking) return null;

  return (
    <button
      className={`btn btn-link btn-sm p-0 ${
        liked ? "text-danger" : "text-muted"
      }`}
      onClick={toggleLike}
      disabled={loading}
    >
      ❤️ {likeCount}
    </button>
  );
}
