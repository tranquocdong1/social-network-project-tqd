import { useCallback, useEffect, useState } from "react";
import { getFeedApi } from "../../../api/posts.api";

export default function useFeed({ limit = 10 } = {}) {
    const [items, setItems] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchFirst = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getFeedApi({ limit });
            setItems(data.items || []);
            setNextCursor(data.nextCursor || null);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to load feed");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const fetchMore = useCallback(async () => {
        if (!nextCursor || loadingMore) return;
        setLoadingMore(true);
        setError(null);
        try {
            const { data } = await getFeedApi({ limit, cursor: nextCursor });
            setItems((prev) => [...prev, ...(data.items || [])]);
            setNextCursor(data.nextCursor || null);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to load more");
        } finally {
            setLoadingMore(false);
        }
    }, [limit, nextCursor, loadingMore]);

    const prependItem = (post) => {
        setItems((prev) => {
            if (prev.some((p) => p.id === post.id)) return prev;
            return [post, ...prev];
        });
    };

    const replaceItem = (tempId, realPost) =>
        setItems((prev) => prev.map((p) => (p.id === tempId ? realPost : p)));
    const updateItem = (id, patch) =>
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

    useEffect(() => {
        fetchFirst();
    }, [fetchFirst]);

    return {
        items,
        nextCursor,
        loading,
        loadingMore,
        error,
        refresh: fetchFirst,
        fetchMore,
        prependItem,
        replaceItem,
        updateItem,
        removeItem,
        setError,
    };
}
