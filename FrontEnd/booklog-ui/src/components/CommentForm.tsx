import { useEffect, useMemo, useState } from 'react';
import type { Book } from '../types';
import { booksApi } from '../api/booksApi';
import { CommentForm } from './CommentForm';

type Props = {
  bookId: number;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChanged: () => void;
};

export function BookDetails({ bookId, onBack, onEdit, onDelete, onChanged }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const b = await booksApi.getById(bookId);
      setBook(b);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load book.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const commentsSorted = useMemo(() => {
    const list = book?.comments ?? [];
    return [...list].sort((a, b) => {
      const at = Date.parse(a.createdAtUtc ?? '');
      const bt = Date.parse(b.createdAtUtc ?? '');
      return bt - at;
    });
  }, [book]);

  return (
    <div className="card">
      <div className="row spaceBetween">
        <button className="btn" onClick={onBack}>← Back</button>
        <div className="row gap">
          <button className="btn" onClick={onEdit}>Edit</button>
          <button className="btn danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <div className="alert">{error}</div>}

      {!loading && book && (
        <>
          <h2 style={{ marginTop: 12 }}>{book.title}</h2>
          <p className="muted">
            <strong>Author:</strong> {book.author} &nbsp;|&nbsp;
            <strong>Year:</strong> {book.publishedYear ?? '-'} &nbsp;|&nbsp;
            <strong>Genre:</strong> {book.genre ?? '-'}
          </p>

          <hr className="hr" />

          <h3>Comments</h3>

          <CommentForm
            onSubmit={async (userName, text) => {
              try {
                setError('');
                await booksApi.addComment(bookId, { userName, text });
                await load();     // refresh details
                await onChanged(); // refresh list too
              } catch (e: any) {
                setError(
                  (e?.message ?? 'Failed to add comment.') +
                    ' (If this endpoint differs in your backend, update booksApi.addComment.)'
                );
              }
            }}
          />

          {commentsSorted.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="commentList">
              {commentsSorted.map(c => (
                <li key={c.id} className="commentItem">
                  <div className="row spaceBetween">
                    <strong>{c.userName}</strong>
                    <span className="muted small">
                      {c.createdAtUtc ? new Date(c.createdAtUtc).toLocaleString() : ''}
                    </span>
                  </div>
                  <div style={{ marginTop: 6 }}>{c.text}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

