// src/pages/MyBooksPage.tsx
import { useEffect, useMemo, useState } from "react";
import { getMyBooksApi, removeFromMyBooksApi, setMyBookStatusApi } from "../api/myBooksApi";
import type { BookStatus, MyBookDto } from "../types/models";

const statuses: BookStatus[] = ["WantToRead", "Reading", "Finished"];

export default function MyBooksPage() {
  const [items, setItems] = useState<MyBookDto[]>([]);
  const [draftStatus, setDraftStatus] = useState<Record<number, BookStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [savingBookId, setSavingBookId] = useState<number | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getMyBooksApi();
      setItems(data);
      setDraftStatus({});
    } catch (e: any) {
      if (e?.response?.status === 401) setError("Please login to see MyBooks.");
      else setError("Could not load MyBooks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const isDirty = (bookId: number) => {
    const current = items.find((x) => x.bookId === bookId)?.status;
    const draft = draftStatus[bookId];
    return draft !== undefined && draft !== current;
  };

  const saveOne = async (bookId: number) => {
    const status = draftStatus[bookId];
    if (!status) return;

    setSavingBookId(bookId);
    setSaveMsg(null);

    try {
      await setMyBookStatusApi(bookId, status);

      setItems((prev) =>
        prev.map((x) => (x.bookId === bookId ? { ...x, status } : x))
      );

      setDraftStatus((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });

      setSaveMsg("Saved ✅");
      setTimeout(() => setSaveMsg(null), 1500);
    } catch {
      setSaveMsg("Could not save. Try again.");
      setTimeout(() => setSaveMsg(null), 2000);
    } finally {
      setSavingBookId(null);
    }
  };

  const removeOne = async (bookId: number) => {
    setError(null);
    try {
      await removeFromMyBooksApi(bookId);
      setItems((prev) => prev.filter((x) => x.bookId !== bookId));
      setDraftStatus((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });
    } catch {
      setError("Could not remove book.");
    }
  };

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => a.book.title.localeCompare(b.book.title));
  }, [items]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h1>MyBooks</h1>
      {saveMsg && <p>{saveMsg}</p>}

      <div style={{ display: "grid", gap: 12, maxWidth: 650 }}>
        {sorted.map((x) => {
          const currentDraft = draftStatus[x.bookId] ?? x.status;

          return (
            <div
              key={x.bookId}
              style={{
                border: "1px solid #444",
                borderRadius: 8,
                padding: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <div>
                <strong>{x.book.title}</strong>
                <div>Author: {x.book.authorName}</div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label>Status:</label>
                <select
                  value={currentDraft}
                  onChange={(e) =>
                    setDraftStatus((prev) => ({
                      ...prev,
                      [x.bookId]: e.target.value as BookStatus,
                    }))
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => saveOne(x.bookId)}
                  disabled={!isDirty(x.bookId) || savingBookId === x.bookId}
                >
                  {savingBookId === x.bookId ? "Saving..." : "Save"}
                </button>

                <button onClick={() => removeOne(x.bookId)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
