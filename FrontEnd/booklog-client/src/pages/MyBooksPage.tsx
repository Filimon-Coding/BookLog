import { useEffect, useState } from "react";
import {
  getMyBooksApi,
  removeFromMyBooksApi,
  setMyBookStatusApi,
} from "../api/myBooksApi";
import type { BookStatus, MyBookDto } from "../types/models";

export default function MyBooksPage() {
  const [items, setItems] = useState<MyBookDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  // draftStatuses stores the "selected" value before saving
  const [draftStatuses, setDraftStatuses] = useState<Record<number, BookStatus>>(
    {}
  );

  const [savingMap, setSavingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadMyBooks();
  }, []);

  async function loadMyBooks() {
    try {
      setError(null);
      const data = await getMyBooksApi();
      setItems(data);
      setDraftStatuses({});
    } catch (e: any) {
      setError(e?.message ?? "Failed to load MyBooks");
    }
  }

  function getUiStatus(item: MyBookDto): BookStatus {
    return draftStatuses[item.bookId] ?? item.status;
  }

  function isDirty(item: MyBookDto): boolean {
    const draft = draftStatuses[item.bookId];
    return !!draft && draft !== item.status;
  }

  function setSaving(bookId: number, value: boolean) {
    setSavingMap((prev) => ({ ...prev, [bookId]: value }));
  }

  async function handleSave(item: MyBookDto) {
    const bookId = item.bookId;
    const draft = draftStatuses[bookId];

    if (!draft || draft === item.status) return;

    try {
      setError(null);
      setSaving(bookId, true);

      const updated = await setMyBookStatusApi(bookId, draft);

      setItems((prev) =>
        prev.map((x) => (x.bookId === bookId ? updated : x))
      );

      setDraftStatuses((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to save status");
    } finally {
      setSaving(bookId, false);
    }
  }

  async function handleRemove(bookId: number) {
    try {
      setError(null);
      setSaving(bookId, true);

      await removeFromMyBooksApi(bookId);
      setItems((prev) => prev.filter((x) => x.bookId !== bookId));

      setDraftStatuses((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to remove book");
    } finally {
      setSaving(bookId, false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>MyBooks</h1>

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      {items.map((item) => {
        const uiStatus = getUiStatus(item);
        const dirty = isDirty(item);
        const saving = !!savingMap[item.bookId];

        return (
          <div
            key={item.bookId}
            style={{
              border: "1px solid #444",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              maxWidth: 520,
            }}
          >
            <h3 style={{ margin: 0 }}>{item.book.title}</h3>
            <p style={{ marginTop: 6, opacity: 0.85 }}>
              Author: {item.book.authorName}
            </p>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ opacity: 0.9 }}>Status:</label>

              <select
                value={uiStatus}
                disabled={saving}
                onChange={(e) => {
                  const newStatus = e.target.value as BookStatus;
                  setDraftStatuses((prev) => ({
                    ...prev,
                    [item.bookId]: newStatus,
                  }));
                }}
              >
                <option value="WantToRead">WantToRead</option>
                <option value="Reading">Reading</option>
                <option value="Finished">Finished</option>
              </select>

              {/* Always visible Save button */}
              <button
                onClick={() => handleSave(item)}
                disabled={saving || !dirty}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: saving || !dirty ? "not-allowed" : "pointer",
                  opacity: saving || !dirty ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : dirty ? "Save" : "Saved"}
              </button>

              <button
                onClick={() => handleRemove(item.bookId)}
                disabled={saving}
                style={{
                  marginLeft: "auto",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                Remove
              </button>
            </div>

            {dirty && (
              <p style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                Status changed — click <b>Save</b> to update the backend.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
