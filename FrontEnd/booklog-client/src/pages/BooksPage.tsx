import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBooksApi } from "../api/booksApi";
import type { BookDto } from "../types/models";

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooksApi()
      .then(setBooks)
      .catch((e) => setError(e?.message ?? "Failed to load books"));
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const b of books) {
      if ((b as any).genre) set.add((b as any).genre);
    }
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return books.filter((b: any) => {
      const title = (b.title ?? "").toLowerCase();
      const author = (b.authorName ?? b.authorUsername ?? "").toLowerCase();
      const g = b.genre ?? "";

      const matchesText = !q || title.includes(q) || author.includes(q);
      const matchesGenre = !genre || g === genre;

      return matchesText && matchesGenre;
    });
  }, [books, search, genre]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Browse</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title/author..."
          style={{ padding: 8, width: 280 }}
        />

        <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ padding: 8 }}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <ul>
        {filtered.map((b: any) => (
          <li key={b.id} style={{ marginBottom: 8 }}>
            <Link to={`/books/${b.id}`}>{b.title}</Link>{" "}
            {b.authorName ? <span>- {b.authorName}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
