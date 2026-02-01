import { useEffect, useMemo, useState } from "react";
import type { BookDto } from "../types/models";
import { uploadCoverApi } from "../api/uploadsApi";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

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

export default function BookForm({
  initial,
  onSave,
  onCancel,
  submitText = "Save",
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    initial?.coverImageUrl ?? ""
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [saving, setSaving] = useState(false);

  const genreOptions = useMemo(() => {
    const list = [...STANDARD_GENRES];
    if (genre && !list.includes(genre)) list.push(genre);
    return list.sort();
  }, [genre]);

  useEffect(() => {
    if (!coverFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const pickFile = (file: File | null) => {
    if (!file) return;

    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      alert("Only JPG, PNG, WEBP allowed.");
      return;
    }

    setCoverFile(file);
  };

  const removeCover = () => {
    setCoverFile(null);
    setPreviewUrl("");
    setCoverImageUrl("");
  };

  const submit = async () => {
    const isEdit = typeof initial?.id === "number";
    const ok = window.confirm(
      isEdit ? "Save changes to this book?" : "Create this book?"
    );
    if (!ok) return;

    setSaving(true);
    try {
      let finalCoverUrl = coverImageUrl;

      if (coverFile) {
        finalCoverUrl = await uploadCoverApi(coverFile);
        setCoverImageUrl(finalCoverUrl);
      }

      await onSave({
        title: title.trim(),
        authorName: authorName.trim(),
        genre: genre.trim(),
        description: description.trim(),
        coverImageUrl: finalCoverUrl || null,
      });

      alert(isEdit ? "Book updated." : "Book created.");
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showExisting = !previewUrl && !!coverImageUrl;
  const imgSrc = previewUrl ? previewUrl : resolveAssetUrl(coverImageUrl);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Author name"
      />

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">Select genre...</option>
        {genreOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Book Cover</div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />

        {(previewUrl || showExisting) && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={imgSrc}
              alt="Cover preview"
              style={{
                width: 120,
                height: 170,
                objectFit: "cover",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--panel)",
              }}
            />

            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {previewUrl ? "Preview (not published yet)" : "Current cover"}
              </div>

              <button
                type="button"
                className="btn"
                onClick={removeCover}
                disabled={saving}
              >
                Remove cover
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          {saving ? "Saving..." : submitText}
        </button>

        {onCancel && (
          <button className="btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
