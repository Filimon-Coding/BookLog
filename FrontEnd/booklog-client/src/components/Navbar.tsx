import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
        opacity="0.95"
      />
      <path
        d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 13.3A7.6 7.6 0 0 1 10.7 3 6.9 6.9 0 1 0 21 13.3Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.95"
      />
    </svg>
  );
}

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  return prefersLight ? "light" : "dark";
}

export default function NavBar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
      .filter((b) => b.title.toLowerCase().includes(term) || b.authorName.toLowerCase().includes(term))
      .slice(0, 6);
  }, [q, allBooks]);

  const submitSearch = (e: React.FormEvent) => {
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
              <NavLink key={x.to} to={x.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
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
                      <div style={{ color: "var(--muted-2)" }}>›</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </form>
        </div>

        {/* ✅ Toggle goes LEFT of login/register/profile */}
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-ghost theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            title="Toggle theme"
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
