type Props = {
  search: string;
  setSearch: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  genres: string[];
  statuses: string[];
};

export default function BookFilters(props: Props) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
      <input
        style={{ padding: 8, minWidth: 260 }}
        placeholder="Search title/author..."
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
      />

      <select value={props.genre} onChange={(e) => props.setGenre(e.target.value)}>
        <option value="">All genres</option>
        {props.genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select value={props.status} onChange={(e) => props.setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {props.statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
