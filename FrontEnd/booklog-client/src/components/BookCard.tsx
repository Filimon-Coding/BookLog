import { Link } from "react-router-dom";
import type { BookDto } from "../types/models";

export default function BookCard({ book }: { book: BookDto }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <h3 style={{ margin: "0 0 6px 0" }}>
        <Link to={`/books/${book.id}`}>{book.title}</Link>
      </h3>
      <div>Author: {book.authorName}</div>
      {book.genre && <div>Genre: {book.genre}</div>}
      {book.status && <div>Status: {book.status}</div>}
    </div>
  );
}
