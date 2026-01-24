import { useEffect, useState } from "react";
import type { BookDto } from "../types/models";
import { createBookApi, deleteBookApi, getBooksApi, updateBookApi } from "../api/booksApi";
import BookForm from "../components/BookForm";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [editing, setEditing] = useState<BookDto | null>(null);

  const load = async () => setBooks(await getBooksApi());

  useEffect(() => {
    load();
  }, []);

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
      <h2>Admin: Manage Books</h2>

      <h3>Create new</h3>
      <BookForm onSave={create} />

      <hr style={{ margin: "16px 0" }} />

      <h3>All books</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {books.map((b) => (
          <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <b>{b.title}</b> — {b.authorName} {b.genre ? `(${b.genre})` : ""}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setEditing(b)}>Edit</button>
                <button onClick={() => remove(b.id)}>Delete</button>
              </div>
            </div>

            {editing?.id === b.id && (
              <div style={{ marginTop: 12 }}>
                <BookForm initial={b} onSave={update} onCancel={() => setEditing(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
