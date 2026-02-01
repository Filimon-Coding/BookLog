import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Role } from "../types/models";
import { useAuth } from "../context/AuthContext";

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;

  if (typeof data === "string") return data;

  // Identity errors often come back as array of strings
  if (Array.isArray(data)) return data.join(", ");

  // Sometimes it can be { errors: [...] } or similar shapes
  if (data?.errors && Array.isArray(data.errors)) return data.errors.join(", ");

  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("Reader");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);

    const u = username.trim();
    if (!u) return setError("Username is required.");
    if (role !== "Reader" && role !== "Author") return setError("Role must be Reader or Author.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await register(u, password, role);
      nav("/");
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-topline" />
        <div className="auth-inner">
          <div className="auth-head">
            <div>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-sub">Register as Reader or Author</p>
            </div>

            <Link to="/" className="btn btn-ghost" aria-label="Close">
              ✕
            </Link>
          </div>

          {error && <p style={{ color: "#fb7185", marginTop: 10 }}>{error}</p>}

          <div className="form-grid">
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Email / Username
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your@email.com"
                autoComplete="username"
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Account Type
              </div>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="Reader">Reader</option>
                <option value="Author">Author</option>
              </select>

              <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted-2)" }}>
                Authors can create and manage their own books.
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Password
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Confirm Password
              </div>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>

            <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "rgba(168,85,247,0.95)" }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
