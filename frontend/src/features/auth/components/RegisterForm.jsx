import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../../api/auth.api";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function RegisterForm() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    return form.fullName.trim().length >= 2 &&
      form.email.includes("@") &&
      form.password.length >= 8;
  }, [form]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    try {
      await registerApi({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="needs-validation" noValidate>
      <div className="mb-3">
        <label className="form-label">Full name</label>
        <input
          className="form-control"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="e.g. Tran Quoc Dong"
          autoComplete="name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <div className="form-text">We’ll never share your email.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>

      <button className="btn btn-primary w-100" disabled={!canSubmit || loading}>
        {loading ? <LoadingSpinner label="Creating..." /> : "Create account"}
      </button>

      <ErrorMessage message={error} />

      <p className="text-muted mt-3 mb-0">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
