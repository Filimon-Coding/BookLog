import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookByIdApi } from "../api/booksApi";
import { addToMyBooksApi, getMyBooksApi } from "../api/myBooksApi";
import {
  addCommentApi,
  deleteCommentApi,
  getCommentsForBookApi,
  updateCommentApi,
} from "../api/commentsApi";
import type { BookDto, BookStatus, CommentDto } from "../types/models";
import { useAuth } from "../context/AuthContext";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";


// BookDetailsPage.tsx
// This page shows detailed information about one specific book.
// It gets the book id from the URL and fetches the book data + comments from the API.
// Users can add a comment and (if allowed) delete their own comment.
// It also may allow adding/changing status in MyBooks from this page.

export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const navigate = useNavigate();

  const { isLoggedIn, user } = useAuth();

  const [book, setBook] = useState<BookDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [myStatus, setMyStatus] = useState<BookStatus | null>(null);
  const [myBusy, setMyBusy] = useState(false);

  const canDeleteAny = user?.role === "Admin";

  const loadMyStatus = async () => {
    if (!isLoggedIn) {
      setMyStatus(null);
      return;
    }

    try {
      const list = await getMyBooksApi();
      const mine = list.find((x) => x.bookId === bookId);
      setMyStatus(mine?.status ?? null);
    } catch {
      // If the user is not logged in (401) or something else happens,
      // we just don't show a status.
      setMyStatus(null);
    }
  };

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

  useEffect(() => {
    if (!Number.isFinite(bookId)) return;
    loadMyStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, isLoggedIn]);

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

  const addToMyBooks = async () => {
    if (!book) return;

    if (!isLoggedIn) {
      const ok = window.confirm("You need to login to use MyBooks. Go to login page?");
      if (ok) navigate("/login");
      return;
    }

    if (myStatus) {
      return;
    }

    const confirmMsg =
      `Add this to MyBooks?\n\n` +
      `Title: ${book.title}\n` +
      `Author: ${book.authorName}\n` +
      `Genre: ${book.genre || "(none)"}\n\n` +
      `Status: WantToRead`;

    const ok = window.confirm(confirmMsg);
    if (!ok) return;

    setMyBusy(true);
    try {
      await addToMyBooksApi(bookId);
      setMyStatus("WantToRead");
    } catch (e: any) {
      if (e?.response?.status === 401) alert("Please login again.");
      else alert("Could not add to MyBooks.");
    } finally {
      setMyBusy(false);
    }
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

            <div style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <h2 style={{ margin: 0 }}>{book.title}</h2>

                <button
                  className={`btn ${myStatus ? "" : "btn-primary"}`}
                  onClick={addToMyBooks}
                  disabled={myBusy || !!myStatus}
                  title={myStatus ? "This book is already in your MyBooks list" : "Add to MyBooks"}
                >
                  {myBusy ? "Adding..." : myStatus ? `In MyBooks (${myStatus})` : "Add to MyBooks"}
                </button>
              </div>

              <div style={{ color: "var(--muted)", marginBottom: 0 }}>
                Author: <span style={{ color: "var(--text)" }}>{book.authorName}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {book.genre && <span className="tag">{book.genre}</span>}
                {book.status && <span className="tag">{book.status}</span>}
              </div>

              {book.description && (
                <p style={{ marginTop: 12, color: "var(--text-soft)" }}>{book.description}</p>
              )}
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
