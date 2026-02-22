import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Role } from "../types/models";
import { useAuth } from "../context/AuthContext";

// RegisterPage.tsx
// This page lets a new user create an account by filling in a simple register form.
// When the user submits, it sends the data to the auth API to create the user.
// If it works, we usually redirect to login (or log in directly if the API returns a token).
// If something fails (like weak password / email already used), it shows an error message.

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;

  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(", ");
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
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Username</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="FirstName"
                autoComplete="username"
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Account Type</div>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="Reader">Reader</option>
                <option value="Author">Author</option>
              </select>

              <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted-2)" }}>
                Authors can create and manage their own books.
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Confirm Password</div>
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
