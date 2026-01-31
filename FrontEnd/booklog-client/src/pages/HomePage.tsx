import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBooksApi } from "../api/booksApi";
import { getMyBooksApi } from "../api/myBooksApi";
import type { BookDto, MyBookDto } from "../types/models";

export default function HomePage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [myBooks, setMyBooks] = useState<MyBookDto[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const b = await getBooksApi();
        setBooks(b);
      } catch {
        setBooks([]);
      }

      // If user isn't logged in -> likely 401, ignore
      try {
        const m = await getMyBooksApi();
        setMyBooks(m);
      } catch {
        setMyBooks([]);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const finished = myBooks.filter((x) => x.status === "Finished").length;
    const reading = myBooks.filter((x) => x.status === "Reading").length;
    const want = myBooks.filter((x) => x.status === "WantToRead").length;
    return { finished, reading, want };
  }, [myBooks]);

  const trending = useMemo(() => books.slice(0, 6), [books]);

  const readingNow = useMemo(
    () => myBooks.filter((x) => x.status === "Reading").slice(0, 3),
    [myBooks]
  );

  return (
    <div className="home-grid">
      {/* LEFT */}
      <div>
        <div className="card hero">
          <div className="hero-inner">
            <div className="hero-kicker">✨ Featured Collection</div>

            <div className="hero-title">Discover Your Next Favorite Book</div>

            <p className="hero-sub">
              Explore curated collections, track your reading progress, and join a community of
              passionate readers.
            </p>

            <Link to="/books" className="btn" style={{ background: "white", color: "#111827" }}>
              Explore Now →
            </Link>
          </div>
        </div>

        <div className="mini-stats">
          <div className="mini-stat">
            <div className="num">{counts.finished}</div>
            <div>
              <div className="label">Books Read</div>
            </div>
          </div>

          <div className="mini-stat">
            <div className="num">{counts.reading}</div>
            <div>
              <div className="label">Reading Now</div>
            </div>
          </div>

          <div className="mini-stat">
            <div className="num">{counts.want}</div>
            <div>
              <div className="label">Want to Read</div>
            </div>
          </div>
        </div>

        <div className="section-row" style={{ marginTop: 22 }}>
          <div className="section-title">Continue Reading</div>
          <Link to="/mybooks" className="view-all">
            View All
          </Link>
        </div>

        <div className="empty-box">
          {readingNow.length === 0 ? (
            <div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                Start tracking your reading
              </div>
              <div style={{ marginTop: 8 }}>
                <Link to="/books" className="view-all">
                  Add a book
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ width: "100%", padding: 16, display: "grid", gap: 10 }}>
              {readingNow.map((x) => (
                <div
                  key={x.bookId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{x.book.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>
                      {x.book.authorName}
                    </div>
                  </div>
                  <Link to={`/books/${x.bookId}`} className="btn btn-ghost">
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-row">
          <div className="section-title">Trending This Week</div>
          <Link to="/books" className="view-all">
            View All
          </Link>
        </div>

        <div className="trending-row">
          {trending.map((b) => (
            <Link key={b.id} to={`/books/${b.id}`} className="book-tile">
              <div className="cover">
                <div className="rating">⭐ 4.{(b.id % 5) + 3}</div>
              </div>
              <div className="title">{b.title}</div>
              <div className="author">{b.authorName}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT (Reading Goal + Community removed) */}
      <div className="right-stack">
        <div className="card card-pad">
          <div className="card-title">Your Reading Stats</div>
          <div className="stat-list">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>Books Read</div>
                <div style={{ fontWeight: 900 }}>{counts.finished}</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📖</div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>
                  Currently Reading
                </div>
                <div style={{ fontWeight: 900 }}>{counts.reading}</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📌</div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>Want to Read</div>
                <div style={{ fontWeight: 900 }}>{counts.want}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Quick Actions</div>
          <div className="quick-actions">
            <Link to="/books" className="action-item">
              <span>Add a Book</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
            </Link>
            <Link to="/mybooks" className="action-item">
              <span>View MyBooks</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
            </Link>
            <div className="action-item" style={{ cursor: "not-allowed", opacity: 0.7 }}>
              <span>Find Friends</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Trending Topics</div>
          <div className="tags">
            <span className="tag">#Fantasy</span>
            <span className="tag">#SciFi</span>
            <span className="tag">#Romance</span>
            <span className="tag">#Thriller</span>
            <span className="tag">#Mystery</span>
            <span className="tag">#Biography</span>
          </div>
        </div>
      </div>
    </div>
  );
}
