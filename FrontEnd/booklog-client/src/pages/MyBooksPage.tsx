import { useEffect, useState } from "react";
import { getMyBooksApi, removeFromMyBooksApi, setMyBookStatusApi } from "../api/myBooksApi";
import type { BookStatus, MyBookDto } from "../types/models";

const statuses: BookStatus[] = ["WantToRead", "Reading", "Finished"];

export default function MyBooksPage() {
  const [items, setItems] = useState<MyBookDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyBooksApi();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (bookId: number, status: BookStatus) => {
    await setMyBookStatusApi(bookId, status);
    await load();
  };

  const remove = async (bookId: number) => {
    await removeFromMyBooksApi(bookId);
    await load();
  };

  return (
    <div>
      <h2>MyBooks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((x) => (
            <div key={x.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
              <h3 style={{ margin: "0 0 6px 0" }}>{x.book.title}</h3>
              <div>Author: {x.book.authorName}</div>

              <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
                <label>Status:</label>
                <select
                  value={x.status}
                  onChange={(e) => changeStatus(x.bookId, e.target.value as BookStatus)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button onClick={() => remove(x.bookId)}>Remove</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p>Your list is empty.</p>}
        </div>
      )}
    </div>
  );
}
