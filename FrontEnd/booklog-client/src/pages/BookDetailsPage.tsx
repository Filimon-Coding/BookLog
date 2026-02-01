import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookByIdApi } from "../api/booksApi";
import {
  addCommentApi,
  deleteCommentApi,
  getCommentsForBookApi,
  updateCommentApi,
} from "../api/commentsApi";
import type { BookDto, CommentDto } from "../types/models";
import { useAuth } from "../context/AuthContext";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const { isLoggedIn, user } = useAuth();

  const [book, setBook] = useState<BookDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);

  const canDeleteAny = user?.role === "Admin";

  const load = async () => {
    setLoading(true);
    try {
      const b = await getBookByIdApi(bookId);
      const c = await getCommentsForBookApi(bookId);
      setBook(b);
      setComments(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(bookId)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const coverUrl = useMemo(() => {
    if (!book?.coverImageUrl) return "";
    return resolveAssetUrl(book.coverImageUrl);
  }, [book]);

  const addComment = async (content: string) => {
    await addCommentApi(bookId, content);
    await load();
  };

  const deleteComment = async (commentId: number) => {
    await deleteCommentApi(commentId); // backend enforces owner/admin
    await load();
  };

  const updateComment = async (commentId: number, content: string) => {
    await updateCommentApi(commentId, content); // backend enforces owner
    await load();
  };

  if (!Number.isFinite(bookId)) return <p>Invalid book id</p>;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {loading ? (
        <p>Loading...</p>
      ) : !book ? (
        <p>Book not found.</p>
      ) : (
        <>
          <div
            className="card card-pad"
            style={{
              display: "grid",
              gridTemplateColumns: coverUrl ? "170px 1fr" : "1fr",
              gap: 16,
              alignItems: "start",
            }}
          >
            {coverUrl && (
              <img
                src={coverUrl}
                alt={`${book.title} cover`}
                style={{
                  width: 170,
                  height: 240,
                  objectFit: "cover",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                }}
              />
            )}

            <div>
              <h2 style={{ margin: "0 0 6px 0" }}>{book.title}</h2>
              <div style={{ color: "var(--muted)", marginBottom: 10 }}>
                Author: <span style={{ color: "var(--text)" }}>{book.authorName}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {book.genre && <span className="tag">{book.genre}</span>}
                {book.status && <span className="tag">{book.status}</span>}
              </div>

              {book.description && <p style={{ marginTop: 12, color: "var(--text-soft)" }}>{book.description}</p>}
            </div>
          </div>

          <div className="card card-pad" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Comments</h3>
              <span style={{ color: "var(--muted)", fontSize: 12 }}>{comments.length} total</span>
            </div>

            <CommentList
              comments={comments}
              currentUserId={user?.id}
              canDeleteAny={!!canDeleteAny}
              onDelete={deleteComment}
              onUpdate={updateComment}
            />

            {isLoggedIn ? (
              <CommentForm onSubmit={addComment} />
            ) : (
              <p style={{ marginTop: 12, color: "var(--muted)" }}>Log in to add a comment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
