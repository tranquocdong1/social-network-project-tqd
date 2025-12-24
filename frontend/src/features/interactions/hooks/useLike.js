import { useEffect, useState } from "react";
import { toggleLikeApi, checkLikedApi } from "../../../api/interactions.api";

export default function useLike(post, onCountChange) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLikedApi(post.id)
      .then((res) => setLiked(res.data.liked))
      .catch(() => {});
  }, [post.id]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    setLiked((v) => !v);
    onCountChange?.((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const { data } = await toggleLikeApi(post.id);
      setLiked(data.liked);
      onCountChange?.(() => data.likeCount);
    } catch {
      setLiked((v) => !v);
      onCountChange?.((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return { liked, toggle, loading };
}
