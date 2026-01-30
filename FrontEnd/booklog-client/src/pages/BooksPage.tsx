import { useEffect, useMemo, useState } from "react";
import { getBooksApi } from "../api/booksApi";
import { getMyBooksApi, setMyBookStatusApi } from "../api/myBooksApi";
import type { BookDto, BookStatus } from "../types/models";
import BookCard from "../components/BookCard";
import BookFilters from "../components/BookFilters";
import { useAuth } from "../context/AuthContext";

export default function BooksPage() {
  const { isLoggedIn } = useAuth();

  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");

  const [error, setError] = useState<string | null>(null);

  // track which books are already in MyBooks
  const [myBookIds, setMyBookIds] = useState<Set<number>>(new Set());
  const [addingMap, setAddingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBooksApi();
        setBooks(data);

        // only fetch mybooks when logged in
        if (isLoggedIn) {
          const my = await getMyBooksApi();
          setMyBookIds(new Set(my.map((x) => x.bookId)));
        } else {
          setMyBookIds(new Set());
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isLoggedIn]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre && set.add(b.genre));
    return Array.from(set).sort();
  }, [books]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.status && set.add(b.status));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchesSearch =
        !s ||
        b.title.toLowerCase().includes(s) ||
        b.authorName.toLowerCase().includes(s);

      const matchesGenre = !genre || b.genre === genre;
      const matchesStatus = !status || b.status === status;

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, search, genre, status]);

  function setAdding(bookId: number, value: boolean) {
    setAddingMap((prev) => ({ ...prev, [bookId]: value }));
  }

  async function handleAddToMyBooks(bookId: number) {
    try {
      setError(null);
      setAdding(bookId, true);

      // default when adding from browse
      const defaultStatus: BookStatus = "WantToRead";
      await setMyBookStatusApi(bookId, defaultStatus);

      // update UI instantly
      setMyBookIds((prev) => {
        const copy = new Set(prev);
        copy.add(bookId);
        return copy;
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to add to MyBooks");
    } finally {
      setAdding(bookId, false);
    }
  }

  return (
    <div>
      <h2>Browse books</h2>

      <BookFilters
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        status={status}
        setStatus={setStatus}
        genres={genres}
        statuses={statuses}
      />

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((b) => {
            const alreadyInMyBooks = myBookIds.has(b.id);
            const adding = !!addingMap[b.id];

            return (
              <div key={b.id} style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                <BookCard book={b} />

                {isLoggedIn && (
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleAddToMyBooks(b.id)}
                      disabled={alreadyInMyBooks || adding}
                      style={{ padding: "6px 12px", borderRadius: 6 }}
                    >
                      {alreadyInMyBooks ? "In MyBooks" : adding ? "Adding..." : "Add to MyBooks"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && <p>No books matched your filters.</p>}
        </div>
      )}

      {!isLoggedIn && (
        <p style={{ marginTop: 12, opacity: 0.8 }}>
          Log in to add books to your MyBooks list.
        </p>
      )}
    </div>
  );
}
