import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      nav("/");
    } catch {
      setError("Login failed. Check username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gap: 10 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button onClick={submit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
