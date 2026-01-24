import { useState } from "react";
import type { BookDto } from "../types/models";

export default function BookForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<BookDto>;
  onSave: (data: Partial<BookDto>) => Promise<void>;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({ title, authorName, genre, description });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6, display: "grid", gap: 10 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author name" />
      <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={submit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
