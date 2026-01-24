import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        paddingBottom: 12,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          BookLog
        </Link>
        <Link to="/books">Browse</Link>
        {isLoggedIn && <Link to="/mybooks">MyBooks</Link>}
        {user?.role === "Admin" && <Link to="/admin/books">Admin</Link>}
        {user?.role === "Author" && <Link to="/author/books">Author</Link>}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            <span>
              {user?.username} ({user?.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
