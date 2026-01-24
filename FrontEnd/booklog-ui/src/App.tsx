import { useEffect, useMemo, useState } from 'react';
import type { Book } from './types.ts';
import { booksApi } from './api/booksApi.ts';
import { BooksList } from './components/BooksList.tsx';
import { BookForm } from './components/BookForm.tsx';
import { BookDetails } from './components/BookDetails.tsx';

type ViewMode = 'list' | 'create' | 'edit' | 'details';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [mode, setMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedBook = useMemo(() => {
    if (selectedId == null) return null;
    return books.find(b => b.id === selectedId) ?? null;
  }, [books, selectedId]);

  async function loadBooks() {
    try {
      setLoading(true);
      setError('');
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load books.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function goList() {
    setMode('list');
    setSelectedId(null);
  }

  function goCreate() {
    setMode('create');
    setSelectedId(null);
  }

  function goEdit(id: number) {
    setSelectedId(id);
    setMode('edit');
  }

  function goDetails(id: number) {
    setSelectedId(id);
    setMode('details');
  }

  async function handleDelete(id: number) {
    const ok = confirm('Delete this book?');
    if (!ok) return;

    try {
      setError('');
      await booksApi.remove(id);
      await loadBooks();
      if (selectedId === id) goList();
    } catch (e: any) {
      setError(e?.message ?? 'Delete failed.');
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">BookLog</h1>
          <p className="subtitle">Simple book CRUD + comments (React + TS)</p>
        </div>

        <div className="headerActions">
          <button className="btn" onClick={goList} disabled={mode === 'list'}>
            Books
          </button>
          <button className="btn primary" onClick={goCreate}>
            + Add Book
          </button>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <main className="content">
        {loading && <div className="card">Loading…</div>}

        {!loading && mode === 'list' && (
          <BooksList
            books={books}
            onOpen={(id) => goDetails(id)}
            onEdit={(id) => goEdit(id)}
            onDelete={(id) => handleDelete(id)}
            onRefresh={loadBooks}
          />
        )}

        {!loading && mode === 'create' && (
          <div className="card">
            <h2>Create book</h2>
            <BookForm
              submitLabel="Create"
              initial={null}
              onCancel={goList}
              onSubmit={async (payload) => {
                try {
                  setError('');
                  await booksApi.create(payload);
                  await loadBooks();
                  goList();
                } catch (e: any) {
                  setError(e?.message ?? 'Create failed.');
                }
              }}
            />
          </div>
        )}

        {!loading && mode === 'edit' && selectedBook && (
          <div className="card">
            <h2>Edit book</h2>
            <BookForm
              submitLabel="Save"
              initial={selectedBook}
              onCancel={goList}
              onSubmit={async (payload) => {
                try {
                  setError('');
                  await booksApi.update(selectedBook.id, payload);
                  await loadBooks();
                  goDetails(selectedBook.id);
                } catch (e: any) {
                  setError(e?.message ?? 'Update failed.');
                }
              }}
            />
          </div>
        )}

        {!loading && mode === 'details' && selectedId != null && (
          <BookDetails
            bookId={selectedId}
            onBack={goList}
            onEdit={() => goEdit(selectedId)}
            onDelete={() => handleDelete(selectedId)}
            onChanged={loadBooks}
          />
        )}

        {!loading && (mode === 'edit') && !selectedBook && (
          <div className="card">
            <p>Selected book not found. Go back to list.</p>
            <button className="btn" onClick={goList}>Back</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Frontend: http://localhost:5173</span>
        <span>Backend: http://localhost:5051</span>
      </footer>
    </div>
  );
}
