import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      // (optional) later you can store token longer if remember=true
      nav("/");
    } catch {
      setError("Login failed. Check username/password.");
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
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-sub">Sign in to continue your reading journey</p>
            </div>

            <Link to="/" className="btn btn-ghost" aria-label="Close">
              ✕
            </Link>
          </div>

          {error && <p style={{ color: "#fb7185", marginTop: 10 }}>{error}</p>}

          <div className="form-grid">
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Email Address
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your@email.com"
              />
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
              />
            </div>

            <div className="form-row">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Remember me
              </label>

              <span style={{ color: "rgba(168,85,247,0.95)" }}>Forgot password?</span>
            </div>

            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
              New here?{" "}
              <Link to="/register" style={{ color: "rgba(168,85,247,0.95)" }}>
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
