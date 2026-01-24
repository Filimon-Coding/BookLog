import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/models";

const roles: Role[] = ["Reader", "Author"]; // Admin should usually be created server-side

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Reader");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await register(username, password, role);
      nav("/");
    } catch {
      setError("Register failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gap: 10 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </div>
    </div>
  );
}
