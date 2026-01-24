import { useEffect, useMemo, useState } from "react";
import { getBooksApi } from "../api/booksApi";
import type { BookDto } from "../types/models";
import BookCard from "../components/BookCard";
import BookFilters from "../components/BookFilters";

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await getBooksApi();
        setBooks(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
          {filtered.length === 0 && <p>No books matched your filters.</p>}
        </div>
      )}
    </div>
  );
}
