import { Link } from "react-router-dom";

// NotFound response page 

export default function NotFoundPage() {
  return (
    <div>
      <h2>Page not found</h2>
      <Link to="/">Go home</Link>
    </div>
  );
}
