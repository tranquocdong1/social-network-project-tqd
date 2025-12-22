import { useMemo, useState } from "react";
import { updatePostApi } from "../../../api/posts.api";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function EditPostModal({ show, onClose, post, onUpdated }) {
  const [content, setContent] = useState(post?.content || "");
  const [imagesText, setImagesText] = useState((post?.images || []).join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => {
    const text = content.trim();
    const imgs = imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return text.length > 0 || imgs.length > 0;
  }, [content, imagesText]);

  if (!show) return null;

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);

    const images = imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5);

    try {
      const { data } = await updatePostApi(post.id, { content: content.trim(), images });
      onUpdated?.(data.post);
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title">Edit post</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label className="form-label">Content</label>
            <textarea className="form-control" rows="4" value={content} onChange={(e) => setContent(e.target.value)} />

            <label className="form-label mt-3">Images (one URL per line)</label>
            <textarea
              className="form-control"
              rows="4"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://..."
            />

            <ErrorMessage message={error} />
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submit} disabled={!canSubmit || loading}>
              {loading ? <LoadingSpinner label="Saving..." /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
