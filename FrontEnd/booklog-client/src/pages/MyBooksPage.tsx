import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBooksApi, removeFromMyBooksApi, setMyBookStatusApi } from "../api/myBooksApi";
import type { BookStatus, MyBookDto } from "../types/models";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

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

    const ok = window.confirm("Save this status change?");
    if (!ok) return;

    setSavingBookId(bookId);
    setSaveMsg(null);

    try {
      await setMyBookStatusApi(bookId, status);

      setItems((prev) => prev.map((x) => (x.bookId === bookId ? { ...x, status } : x)));

      setDraftStatus((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });

      alert("Status saved.");
    } catch {
      alert("Could not save. Try again.");
    } finally {
      setSavingBookId(null);
    }
  };

  const removeOne = async (bookId: number) => {
    const ok = window.confirm("Remove this book from MyBooks?");
    if (!ok) return;

    setError(null);
    try {
      await removeFromMyBooksApi(bookId);
      setItems((prev) => prev.filter((x) => x.bookId !== bookId));
      setDraftStatus((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });

      alert("Removed from MyBooks.");
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

      <div className="page-head">
          <h1 className="page-title">MyBooks</h1>
          <p className="page-subtitle">
            Your personal reading list. Track what you want to read, what you’re reading, and what you finished.
          </p>
      </div>

      
      {saveMsg && <p>{saveMsg}</p>}

      <div className="booklist">
        {sorted.map((x) => {
          const currentDraft = draftStatus[x.bookId] ?? x.status;
          const img = x.book.coverImageUrl ? resolveAssetUrl(x.book.coverImageUrl) : "";

          return (
            <div key={x.bookId} className="bookrow card mybookrow">
              <Link to={`/books/${x.bookId}`} className="bookcover" aria-label={`Open ${x.book.title}`}>
                {img ? <img src={img} alt={`${x.book.title} cover`} /> : <div className="cover-fallback" />}
              </Link>

              <div className="bookmeta">
                <Link to={`/books/${x.bookId}`} className="booktitle">
                  {x.book.title}
                </Link>
                <div className="bookauthor">by {x.book.authorName}</div>
              </div>

              <div className="bookaction mybook-actions">
                <div className="mybook-controls">
                  <label className="mybook-label">Status</label>
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
                </div>

                <div className="mybook-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => saveOne(x.bookId)}
                    disabled={!isDirty(x.bookId) || savingBookId === x.bookId}
                  >
                    {savingBookId === x.bookId ? "Saving..." : "Save"}
                  </button>

                  <button className="btn" onClick={() => removeOne(x.bookId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
