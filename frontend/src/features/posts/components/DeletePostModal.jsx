import { useState } from "react";
import { deletePostApi } from "../../../api/posts.api";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function DeletePostModal({ show, onClose, postId, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await deletePostApi(postId);
      onDeleted?.();
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title">Delete post</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="mb-0">Are you sure you want to delete this post?</p>
            <ErrorMessage message={error} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={submit} disabled={loading}>
              {loading ? <LoadingSpinner label="Deleting..." /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
