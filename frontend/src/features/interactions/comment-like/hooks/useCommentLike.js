import { useEffect, useState } from "react";
import {
  toggleCommentLikeApi,
  checkCommentLikedApi,
} from "../../../../api/interactions.api";

export default function useCommentLike(comment) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    checkCommentLikedApi(comment.id)
      .then(({ data }) => {
        if (mounted) setLiked(data.liked);
      })
      .catch(() => {})
      .finally(() => mounted && setChecking(false));

    return () => {
      mounted = false;
    };
  }, [comment.id]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    setLiked((v) => !v);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));

    try {
      const { data } = await toggleCommentLikeApi(comment.id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? c + 1 : Math.max(0, c - 1)));
      setError("Failed to like comment");
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    likeCount,
    toggleLike,
    loading,
    checking,
    error,
  };
}
