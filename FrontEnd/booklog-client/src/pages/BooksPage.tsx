// src/pages/BooksPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBooksApi } from "../api/booksApi";
import { addToMyBooksApi, getMyBooksApi } from "../api/myBooksApi";
import type { BookDto } from "../types/models";
import BookFilters from "../components/BookFilters";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");

  // If user is logged in, we can mark which books are already in MyBooks
  const [myBookIds, setMyBookIds] = useState<Set<number>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await getBooksApi();
        setBooks(data);
      } catch {
        setError("Could not load books.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Try fetch MyBooks (only works when logged in). If 401 -> ignore.
  useEffect(() => {
    (async () => {
      try {
        const my = await getMyBooksApi();
        setMyBookIds(new Set(my.map((x) => x.bookId)));
      } catch {
        // not logged in - ignore
      }
    })();
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.genre));
    return ["", ...Array.from(set).sort()];
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.authorName.toLowerCase().includes(q);

      const matchesGenre = !genre || b.genre === genre;
      return matchesQuery && matchesGenre;
    });
  }, [books, query, genre]);

  const addToMyBooks = async (bookId: number) => {
    const ok = window.confirm("Add this book to MyBooks?");
    if (!ok) return;

    setActionError(null);
    setAddingId(bookId);

    try {
      await addToMyBooksApi(bookId);
      setMyBookIds((prev) => new Set(prev).add(bookId));
      alert("Book added to MyBooks.");
    } catch (e: any) {
      if (e?.response?.status === 401) {
        setActionError("You must be logged in to add books to MyBooks.");
      } else {
        setActionError("Could not add the book. Try again.");
      }
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h1>Browse</h1>

      {actionError && <p style={{ color: "crimson" }}>{actionError}</p>}

      <BookFilters
        query={query}
        setQuery={setQuery}
        genre={genre}
        setGenre={setGenre}
        genres={genres}
      />

      <div className="booklist">
        {filtered.map((b) => {
          const inMyBooks = myBookIds.has(b.id);
          const img = b.coverImageUrl ? resolveAssetUrl(b.coverImageUrl) : "";

          return (
            <div key={b.id} className="bookrow card">
              <Link to={`/books/${b.id}`} className="bookcover" aria-label={`Open ${b.title}`}>
                {img ? <img src={img} alt={`${b.title} cover`} /> : <div className="cover-fallback" />}
              </Link>

              <div className="bookmeta">
                <Link to={`/books/${b.id}`} className="booktitle">
                  {b.title}
                </Link>

                <div className="bookauthor">by {b.authorName}</div>

                <div className="bookmeta-row">
                  {b.genre ? <span className="tag">{b.genre}</span> : null}
                  {b.status ? <span className="tag">{b.status}</span> : null}
                </div>
              </div>

              <div className="bookaction">
                <button
                  className={`btn ${inMyBooks ? "btn-ghost" : "btn-primary"}`}
                  onClick={() => addToMyBooks(b.id)}
                  disabled={inMyBooks || addingId === b.id}
                  title={inMyBooks ? "Already in MyBooks" : "Add to MyBooks"}
                >
                  {inMyBooks ? "Added" : addingId === b.id ? "Adding..." : "Add to MyBooks"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
