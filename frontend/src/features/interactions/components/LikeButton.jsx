import useLike from "../hooks/useLike";

export default function LikeButton({ post, onLikeCountChange }) {
  const { liked, toggle, loading } = useLike(post, onLikeCountChange);

  return (
    <button
      className={`btn btn-sm ${liked ? "btn-danger" : "btn-outline-danger"}`}
      onClick={toggle}
      disabled={loading}
    >
      ❤️ {post.likeCount ?? 0}
    </button>
  );
}
