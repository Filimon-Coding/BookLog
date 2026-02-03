import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BookDto } from "../types/models";
import { createBookApi, deleteBookApi, getBooksApi, updateBookApi } from "../api/booksApi";
import BookForm from "../components/BookForm";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [editing, setEditing] = useState<BookDto | null>(null);

  const load = async () => setBooks(await getBooksApi());

  useEffect(() => {
    load();
  }, []);

  const create = async (data: Partial<BookDto>) => {
    const ok = window.confirm("Create this book?");
    if (!ok) return;

    try {
      await createBookApi(data);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data || "Could not create book.";
      alert(msg);
    }
  };

  const update = async (data: Partial<BookDto>) => {
    if (!editing) return;

    const ok = window.confirm("Save changes to this book?");
    if (!ok) return;

    try {
      await updateBookApi(editing.id, data);
      setEditing(null);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data || "Could not update book.";
      alert(msg);
    }
  };

  const remove = async (id: number) => {
    const ok = window.confirm("Delete this book?");
    if (!ok) return;

    try {
      await deleteBookApi(id);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data || "Could not delete book.";
      alert(msg);
    }
  };

  return (
    <div>
      <h2>Admin: Manage Books</h2>

      <h3>Create new</h3>
      <BookForm onSave={create} />

      <hr style={{ margin: "16px 0", borderColor: "var(--border)" }} />

      <h3>All books</h3>

      <div className="booklist">
        {books.map((b) => {
          const img = b.coverImageUrl ? resolveAssetUrl(b.coverImageUrl) : "";

          return (
            <div key={b.id} className="card" style={{ padding: 12 }}>
              <div className="bookrow adminrow" style={{ padding: 0 }}>
                <Link to={`/books/${b.id}`} className="bookcover" aria-label={`Open ${b.title}`}>
                  {img ? <img src={img} alt={`${b.title} cover`} /> : <div className="cover-fallback" />}
                </Link>

                <div className="bookmeta">
                  <Link to={`/books/${b.id}`} className="booktitle">
                    {b.title}
                  </Link>
                  <div className="bookauthor">by {b.authorName}</div>
                  {b.genre ? (
                    <div className="bookmeta-row">
                      <span className="tag">{b.genre}</span>
                    </div>
                  ) : null}
                </div>

                <div className="bookaction">
                  <button className="btn" onClick={() => setEditing(b)}>
                    Edit
                  </button>
                  <button className="btn" onClick={() => remove(b.id)}>
                    Delete
                  </button>
                </div>
              </div>

              {editing?.id === b.id && (
                <div style={{ marginTop: 12 }}>
                  <BookForm initial={b} onSave={update} onCancel={() => setEditing(null)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
