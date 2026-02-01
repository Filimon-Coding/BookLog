type Props = {
  query: string;
  setQuery: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  genres: string[];
};

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
