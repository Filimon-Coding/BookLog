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

export default function BookForm({ initial, onSave, onCancel, submitText = "Save" }: Props) {
  const isEdit = typeof initial?.id === "number";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const [coverImageUrl, setCoverImageUrl] = useState<string>(initial?.coverImageUrl ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [saving, setSaving] = useState(false);

  // --- required field validation state ---
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    authorName: false,
    genre: false,
  });

  const titleTrim = title.trim();
  const authorTrim = authorName.trim();
  const genreTrim = genre.trim();

  const errors = useMemo(() => {
    return {
      title: !titleTrim ? "Title required" : "",
      authorName: !authorTrim ? "Author name required" : "",
      genre: !genreTrim ? "Genre required" : "",
    };
  }, [titleTrim, authorTrim, genreTrim]);

  const showTitleError = (submitted || touched.title) && !!errors.title;
  const showAuthorError = (submitted || touched.authorName) && !!errors.authorName;
  const showGenreError = (submitted || touched.genre) && !!errors.genre;

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
    const ok = window.confirm("Remove the cover image?");
    if (!ok) return;

    setCoverFile(null);
    setPreviewUrl("");
    setCoverImageUrl("");
    // NOTE: no success alert here (avoid extra popups)
  };

  const submit = async () => {
    setSubmitted(true);

    // block submit if required fields missing
    if (errors.title || errors.authorName || errors.genre) {
      setTouched({ title: true, authorName: true, genre: true });
      return;
    }

    setSaving(true);
    try {
      let finalCoverUrl = coverImageUrl;

      // upload cover if chosen
      if (coverFile) {
        finalCoverUrl = await uploadCoverApi(coverFile);
        setCoverImageUrl(finalCoverUrl);
      }

      // IMPORTANT: no confirm(), no success alert() here
      await onSave({
        title: titleTrim,
        authorName: authorTrim,
        genre: genreTrim,
        description: description.trim(),
        coverImageUrl: finalCoverUrl || null,
      });

      // after create: clear the form to avoid accidental double create
      if (!isEdit) {
        setTitle("");
        setAuthorName("");
        setGenre("");
        setDescription("");
        setCoverFile(null);
        setPreviewUrl("");
        setCoverImageUrl("");
        setSubmitted(false);
        setTouched({ title: false, authorName: false, genre: false });
      } else {
        // edit mode: just reset submit state
        setCoverFile(null);
        setSubmitted(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const showExisting = !previewUrl && !!coverImageUrl;
  const imgSrc = previewUrl ? previewUrl : resolveAssetUrl(coverImageUrl);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {/* Title */}
      <div className="field">
        <div className="field-label">
          Title <span className="required">*</span>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          placeholder="Title"
          className={showTitleError ? "input-error" : ""}
          aria-invalid={showTitleError}
        />
        {showTitleError && <div className="field-error">{errors.title}</div>}
      </div>

      {/* Author */}
      <div className="field">
        <div className="field-label">
          Author name <span className="required">*</span>
        </div>
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, authorName: true }))}
          placeholder="Author name"
          className={showAuthorError ? "input-error" : ""}
          aria-invalid={showAuthorError}
        />
        {showAuthorError && <div className="field-error">{errors.authorName}</div>}
      </div>

      {/* Genre */}
      <div className="field">
        <div className="field-label">
          Genre <span className="required">*</span>
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, genre: true }))}
          className={showGenreError ? "input-error" : ""}
          aria-invalid={showGenreError}
        >
          <option value="">Select genre...</option>
          {genreOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {showGenreError && <div className="field-error">{errors.genre}</div>}
      </div>

      {/* Description (optional) */}
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />

      {/* Cover */}
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Book Cover (optional)</div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />

        {(previewUrl || showExisting) && (
          <div className="cover-row">
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

              <button type="button" className="btn" onClick={removeCover} disabled={saving}>
                Remove cover
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="form-actions">
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
