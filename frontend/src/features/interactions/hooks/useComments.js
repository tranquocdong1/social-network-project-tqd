import { useEffect, useState } from "react";
import {
  createCommentApi,
  deleteCommentApi,
  getCommentsApi,
} from "../../../api/interactions.api";

export default function useComments(postId) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getCommentsApi(postId, { limit: 5 });
      setItems(data.items);
      setCursor(data.nextCursor);
    } catch {
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data } = await getCommentsApi(postId, {
        limit: 5,
        cursor,
      });
      setItems((p) => [...p, ...data.items]);
      setCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  const add = async (content) => {
    const { data } = await createCommentApi(postId, { content });
    setItems((p) => [data, ...p]);
  };

  const remove = async (commentId) => {
    await deleteCommentApi(commentId);
    setItems((p) => p.filter((c) => c.id !== commentId));
  };

  useEffect(() => {
    load();
  }, [postId]);

  return { items, loadMore, add, remove, loading, loadingMore, error };
}
