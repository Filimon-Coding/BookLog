type Props = {
  query: string;
  setQuery: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  genres: string[];
};

// BookFilters.tsx
// This component holds the filter controls used on the Books page (like search, genre, etc.).
// It updates filter state when the user types/selects something, and sends it back to the parent page.
// The parent page then uses these values to filter the book list that is shown.
// Keeping filters in a separate component makes BooksPage cleaner and easier to read.

export default function BookFilters({ query, setQuery, genre, setGenre, genres }: Props) {
  return (
    <div className="filters">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title/author..." />
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        {genres.map((g) => (
          <option key={g || "__all"} value={g}>
            {g ? g : "All genres"}
          </option>
        ))}
      </select>
    </div>
  );
}
