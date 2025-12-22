import PostCard from "./PostCard";

export default function PostList({ items, onUpdated, onRemoved }) {
  if (!items?.length) {
    return <div className="text-muted text-center mt-4">No posts yet.</div>;
  }

  return (
    <div className="mt-3 d-flex flex-column gap-3">
      {items.map((p) => (
        <PostCard key={p.id} post={p} onUpdated={onUpdated} onRemoved={onRemoved} />
      ))}
    </div>
  );
}
