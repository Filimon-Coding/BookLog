import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h2>Page not found</h2>
      <Link to="/">Go home</Link>
    </div>
  );
}
