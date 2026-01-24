import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>BookLog</h1>
      <p>A simple book review platform. Browse books, comment, and track your reading list.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/books">
          <button>Browse books</button>
        </Link>
        <Link to="/mybooks">
          <button>MyBooks</button>
        </Link>
      </div>
    </div>
  );
}
