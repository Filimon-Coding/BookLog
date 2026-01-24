import { Book } from '../types';

type Props = {
  books: Book[];
  onOpen: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
};

export function BooksList({ books, onOpen, onEdit, onDelete, onRefresh }: Props) {
  return (
    <div className="card">
      <div className="row spaceBetween">
        <h2>Books</h2>
        <button className="btn" onClick={onRefresh}>Refresh</button>
      </div>

      {books.length === 0 ? (
        <p>No books yet. Create one.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Title</th>
              <th style={{ width: '25%' }}>Author</th>
              <th style={{ width: '15%' }}>Year</th>
              <th style={{ width: '15%' }}>Genre</th>
              <th style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>
                  <button className="link" onClick={() => onOpen(b.id)}>
                    {b.title}
                  </button>
                </td>
                <td>{b.author}</td>
                <td>{b.publishedYear ?? '-'}</td>
                <td>{b.genre ?? '-'}</td>
                <td className="actions">
                  <button className="btn small" onClick={() => onEdit(b.id)}>Edit</button>
                  <button className="btn small danger" onClick={() => onDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
