// src/components/BookForm.tsx
import { useMemo, useState } from "react";
import type { BookDto } from "../types/models";

type Props = {
  initial?: Partial<BookDto>;
  onSave: (payload: Partial<BookDto>) => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string;
};

const STANDARD_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Historical",
  "Biography",
  "Non-fiction",
  "Self-help",
  "Business",
  "Programming",
  "Young Adult",
  "Children",
];

export default function BookForm({ initial, onSave, onCancel, submitText = "Save" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const genreOptions = useMemo(() => {
    const list = [...STANDARD_GENRES];
    if (genre && !list.includes(genre)) list.push(genre);
    return list.sort();
  }, [genre]);

  const submit = async () => {
    await onSave({
      title: title.trim(),
      authorName: authorName.trim(),
      genre: genre.trim(),
      description: description.trim(),
    });
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author name" />

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">Select genre...</option>
        {genreOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={submit}>{submitText}</button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
