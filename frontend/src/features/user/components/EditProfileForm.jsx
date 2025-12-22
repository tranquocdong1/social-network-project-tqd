import { useMemo, useState } from "react";
import { updateProfileApi } from "../../../api/user.api";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function EditProfileForm({ user, onUpdated }) {
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => form.fullName.trim().length >= 2, [form.fullName]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await updateProfileApi({
        fullName: form.fullName.trim(),
        bio: form.bio.trim() || null,
        avatar: form.avatar.trim() || null,
      });
      onUpdated(data.user);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input
              className="form-control"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <div className="form-text">2–50 characters.</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Avatar URL</label>
            <input
              className="form-control"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <div className="form-text">Max 160 chars.</div>
          </div>

          <button className="btn btn-primary" disabled={!canSubmit || loading}>
            {loading ? <LoadingSpinner label="Saving..." /> : "Save changes"}
          </button>

          <ErrorMessage message={error} />
        </div>
      </div>
    </form>
  );
}
