import { useMemo, useState } from "react";
import useFeed from "../hooks/useFeed";
import PostComposer from "../components/PostComposer";
import PostList from "../components/PostList";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function FeedPage() {
    const feed = useFeed({ limit: 10 });
    const [toast, setToast] = useState(null);

    const canLoadMore = useMemo(() => !!feed.nextCursor, [feed.nextCursor]);

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h4 fw-bold mb-0">News Feed</h1>
                    <button className="btn btn-outline-secondary btn-sm" onClick={feed.refresh}>
                        Refresh
                    </button>
                </div>

                <PostComposer
                    onOptimistic={(tempPost) => feed.prependItem(tempPost)}
                    onReplace={(tempId, realPost) => feed.replaceItem(tempId, realPost)}
                    onError={(msg) => feed.setError(msg)}
                />

                {toast && (
                    <div className="alert alert-success py-2 mt-3" role="alert">
                        {toast}
                    </div>
                )}

                {feed.loading ? (
                    <div className="mt-4">
                        <LoadingSpinner label="Loading feed..." />
                    </div>
                ) : (
                    <>
                        <ErrorMessage message={feed.error} />
                        <PostList
                            items={feed.items}
                            onUpdated={(id, patch) => feed.updateItem(id, patch)}
                            onRemoved={(id) => feed.removeItem(id)}
                        />

                        <div className="d-grid mt-3">
                            {canLoadMore ? (
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={feed.fetchMore}
                                    disabled={feed.loadingMore}
                                >
                                    {feed.loadingMore ? "Loading..." : "Load more"}
                                </button>
                            ) : (
                                <div className="text-muted text-center small py-3">No more posts</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
