import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { BookDto } from "../types/models";
import { createBookApi, deleteBookApi, getBooksApi, updateBookApi } from "../api/booksApi";
import { useAuth } from "../context/AuthContext";
import BookForm from "../components/BookForm";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

// AuthorBooksPage.tsx
// This page is the “Author dashboard” where an author can manage their own books.
// It fetches the logged-in author’s books from the API and shows them in a list/table.
// The author can usually create a new book, edit an existing one, and delete their own books.
// It also handles simple loading/error states while waiting for the API response.

export default function AuthorBooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [editing, setEditing] = useState<BookDto | null>(null);

  const load = async () => setBooks(await getBooksApi());

  useEffect(() => {
    load();
  }, []);

  const myBooks = useMemo(() => {
    if (!user) return [];
    return books.filter((b) => b.createdByUserId === user.id);
  }, [books, user]);

  const create = async (data: Partial<BookDto>) => {
    const ok = window.confirm("Create this book?");
    if (!ok) return;

    try {
      await createBookApi(data);
      await load(); // UI update is your success feedback (no extra alert)
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
      <div className="page-head">
        <h1 className="page-title">Author: My books</h1>
        <p className="page-subtitle">
         Here you can create your book, Make sure to include Title, Author and genre. 
        </p>
      </div>
            

      <h3>Create new</h3>
      <BookForm onSave={create} />

      <hr style={{ margin: "16px 0", borderColor: "var(--border)" }} />

      <h3>My books</h3>
        <div className="page-head">
          <h1 className="page-title">My books</h1>
          <p className="page-subtitle">
            Here are all the books you’ve published. You can edit or delete your books from this list.
          </p>
        </div>
      <div className="booklist">
        {myBooks.map((b) => {
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
                  <button className="btn btn-primary" onClick={() => setEditing(b)}>
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

        {myBooks.length === 0 && <p>No books found.</p>}
      </div>
    </div>
  );
}
