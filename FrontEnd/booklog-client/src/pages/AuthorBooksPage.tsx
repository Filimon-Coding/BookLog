import { useEffect, useMemo, useState } from "react";
import type { BookDto } from "../types/models";
import { createBookApi, deleteBookApi, getBooksApi, updateBookApi } from "../api/booksApi";
import { useAuth } from "../context/AuthContext";
import BookForm from "../components/BookForm";

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
    await createBookApi(data);
    await load();
  };

  const update = async (data: Partial<BookDto>) => {
    if (!editing) return;
    await updateBookApi(editing.id, data);
    setEditing(null);
    await load();
  };

  const remove = async (id: number) => {
    await deleteBookApi(id);
    await load();
  };

  return (
    <div>
      <h2>Author: My Books</h2>

      <h3>Create new</h3>
      <BookForm onSave={create} />

      <hr style={{ margin: "16px 0", borderColor: "var(--border)" }} />

      <h3>My books</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {myBooks.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid var(--border)",
              background: "var(--panel)",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <b>{b.title}</b> — {b.authorName}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
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
        ))}
        {myBooks.length === 0 && <p>No books found (backend must expose ownership info).</p>}
      </div>
    </div>
  );
}
