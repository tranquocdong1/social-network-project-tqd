import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../api/auth.api";
import { useAuth } from "../auth.context";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => form.email.includes("@") && form.password.length > 0, [form]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await loginApi({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);

      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Your password"
          autoComplete="current-password"
        />
      </div>

      <button className="btn btn-primary w-100" disabled={!canSubmit || loading}>
        {loading ? <LoadingSpinner label="Logging in..." /> : "Login"}
      </button>

      <ErrorMessage message={error} />

      <p className="text-muted mt-3 mb-0">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
