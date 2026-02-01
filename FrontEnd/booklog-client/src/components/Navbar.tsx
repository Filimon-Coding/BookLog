import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBooksApi } from "../api/booksApi";
import type { BookDto } from "../types/models";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 13.2A7.8 7.8 0 0 1 10.8 3 6.8 6.8 0 1 0 21 13.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavBar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const [allBooks, setAllBooks] = useState<BookDto[]>([]);
  const [booksLoaded, setBooksLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const b = await getBooksApi();
        setAllBooks(b);
      } catch {
        setAllBooks([]);
      } finally {
        setBooksLoaded(true);
      }
    })();
  }, []);

  const navItems = useMemo(() => {
    return [
      { to: "/books", label: "Browse", show: true },
      { to: "/mybooks", label: "MyBooks", show: isLoggedIn },
      { to: "/admin/books", label: "Admin", show: user?.role === "Admin" },
      { to: "/author/books", label: "Author", show: user?.role === "Author" },
    ].filter((x) => x.show);
  }, [isLoggedIn, user?.role]);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return allBooks
      .filter(
        (b) => b.title.toLowerCase().includes(term) || b.authorName.toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [q, allBooks]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/books?q=${encodeURIComponent(term)}` : "/books");
    setOpen(false);
  };

  const goToBook = (id: number) => {
    navigate(`/books/${id}`);
    setOpen(false);
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" className="brand">
            <img className="brand-logo" src="/favicon.svg" alt="BookLog logo" />
            <span className="brand-text">BookLog</span>
          </Link>

          <nav className="nav-links">
            {navItems.map((x) => (
              <NavLink
                key={x.to}
                to={x.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {x.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="nav-search">
          <form className="nav-search-box" onSubmit={submitSearch}>
            <span className="nav-search-icon">
              <SearchIcon />
            </span>

            <input
              className="nav-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search books, authors..."
            />

            {open && q.trim() && (
              <div className="nav-suggest">
                {!booksLoaded ? (
                  <div className="nav-suggest-empty">Loading...</div>
                ) : suggestions.length === 0 ? (
                  <div className="nav-suggest-empty">No matches</div>
                ) : (
                  suggestions.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="nav-suggest-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToBook(b.id)}
                    >
                      <div>
                        <div className="nav-suggest-title">{b.title}</div>
                        <div className="nav-suggest-sub">{b.authorName}</div>
                      </div>
                      <div style={{ color: "var(--muted)" }}>›</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </form>
        </div>

        {/* ✅ Toggle sits between search and auth buttons */}
        <div className="nav-actions">
          <button
            className="btn btn-ghost theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {isLoggedIn ? (
            <>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>
                {user?.username} ({user?.role})
              </span>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
