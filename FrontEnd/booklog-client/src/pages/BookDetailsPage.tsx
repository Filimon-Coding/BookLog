import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookByIdApi } from "../api/booksApi";
import { addCommentApi, deleteCommentApi, getCommentsForBookApi } from "../api/commentsApi";
import type { BookDto, CommentDto } from "../types/models";
import { useAuth } from "../context/AuthContext";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

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

  const addComment = async (content: string) => {
    await addCommentApi(bookId, content);
    await load();
  };

  const deleteComment = async (commentId: number) => {
    if (!canDeleteAny) return;
    await deleteCommentApi(commentId);
    await load();
  };

  if (!Number.isFinite(bookId)) return <p>Invalid book id</p>;

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : !book ? (
        <p>Book not found.</p>
      ) : (
        <>
          <h2>{book.title}</h2>
          <div>Author: {book.authorName}</div>
          {book.genre && <div>Genre: {book.genre}</div>}
          {book.description && <p style={{ marginTop: 10 }}>{book.description}</p>}

          <hr style={{ margin: "16px 0" }} />

          <h3>Comments</h3>
          <CommentList comments={comments} canDeleteAny={!!canDeleteAny} onDelete={deleteComment} />

          {isLoggedIn ? (
            <CommentForm onSubmit={addComment} />
          ) : (
            <p style={{ marginTop: 12 }}>Log in to add a comment.</p>
          )}
        </>
      )}
    </div>
  );
}
