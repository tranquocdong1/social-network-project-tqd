import { useMemo, useRef, useState } from "react";
import { createPostApi } from "../../../api/posts.api";
import { useAuth } from "../../auth/auth.context";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function PostComposer({ onCreated, onOptimistic, onReplace, onError }) {
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => {
    return content.trim().length > 0 || files.length > 0;
  }, [content, files]);

  const clearForm = () => {
    setContent("");
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      author: { id: user.id, fullName: user.fullName, avatar: user.avatar || null },
      content: content.trim(),
      images: files.map((f) => URL.createObjectURL(f)), // preview tạm
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    onOptimistic?.(optimistic);

    try {
      const fd = new FormData();
      fd.append("content", content.trim());
      files.forEach((f) => fd.append("images", f));

      const { data } = await createPostApi(fd);

      onReplace?.(tempId, data);
      clearForm();
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Create post failed";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3 p-md-4">
        <form onSubmit={submit}>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="3"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <input
                ref={fileRef}
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
              />
              <span className="text-muted small">Max 5 images</span>
            </div>

            <button className="btn btn-primary" disabled={!canSubmit || loading}>
              {loading ? <LoadingSpinner label="Posting..." /> : "Post"}
            </button>
          </div>

          <ErrorMessage message={error} />
        </form>

        {files.length > 0 && (
          <div className="mt-3">
            <div className="text-muted small mb-2">Preview</div>
            <div className="d-flex flex-wrap gap-2">
              {files.map((f) => (
                <img
                  key={f.name + f.size}
                  src={URL.createObjectURL(f)}
                  alt="preview"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                  className="rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
