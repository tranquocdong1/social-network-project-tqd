import {  useState } from "react";
import { getRepliesApi, createReplyApi } from "../../../../api/interactions.api";

export default function useReplies(commentId) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadReplies = async () => {
    if (loaded) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await getRepliesApi(commentId);
      setReplies(data.items || []);
      setLoaded(true);
    } catch {
      setError("Failed to load replies");
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (content) => {
    setSubmitting(true);
    try {
      const { data } = await createReplyApi(commentId, { content });
      setReplies((prev) => [...prev, data]);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    replies,
    loadReplies,
    addReply,
    loading,
    submitting,
    error,
  };
}
