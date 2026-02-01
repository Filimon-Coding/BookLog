import { Link } from "react-router-dom";
import type { BookDto } from "../types/models";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

export default function BookCard({ book }: { book: BookDto }) {
  const coverUrl = book.coverImageUrl ? resolveAssetUrl(book.coverImageUrl) : "";

  return (
    <div className="card card-pad" style={{ display: "flex", gap: 14, alignItems: "center" }}>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`${book.title} cover`}
          style={{
            width: 84,
            height: 120,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--panel)",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 84,
            height: 120,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background:
              "radial-gradient(120px 90px at 30% 25%, rgba(168, 85, 247, 0.35), transparent 60%), radial-gradient(140px 100px at 70% 70%, rgba(236, 72, 153, 0.25), transparent 60%), var(--panel)",
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ display: "grid", gap: 6, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            <Link to={`/books/${book.id}`} style={{ color: "var(--text)" }}>
              {book.title}
            </Link>
          </h3>

          {book.status && (
            <span className="tag" style={{ height: "fit-content" }}>
              {book.status}
            </span>
          )}
        </div>

        <div style={{ color: "var(--muted)", fontSize: 13 }}>{book.authorName}</div>
        {book.genre && <div style={{ color: "var(--muted-2)", fontSize: 12 }}>{book.genre}</div>}
      </div>
    </div>
  );
}
