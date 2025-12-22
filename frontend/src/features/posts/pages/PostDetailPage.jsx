import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetailApi } from "../../../api/posts.api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import PostCard from "../components/PostCard";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getPostDetailApi(id);
        setPost(data);
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading post..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return null;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <PostCard post={post} onUpdated={(pid, patch) => setPost((p) => ({ ...p, ...patch }))} onRemoved={() => {}} />
      </div>
    </div>
  );
}
