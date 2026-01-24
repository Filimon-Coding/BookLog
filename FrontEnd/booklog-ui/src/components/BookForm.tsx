import { useEffect, useState } from 'react';
import { Book, BookUpsert } from '../types';

type Props = {
  initial: Book | null;
  submitLabel: string;
  onSubmit: (payload: BookUpsert) => void | Promise<void>;
  onCancel: () => void;
};

export function BookForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publishedYear, setPublishedYear] = useState<string>('');

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title ?? '');
    setAuthor(initial.author ?? '');
    setGenre(initial.genre ?? '');
    setPublishedYear(initial.publishedYear != null ? String(initial.publishedYear) : '');
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert('Title and Author are required.');
      return;
    }

    const yearNum =
      publishedYear.trim() === '' ? null : Number(publishedYear.trim());

    if (yearNum != null && Number.isNaN(yearNum)) {
      alert('Published year must be a number.');
      return;
    }

    const payload: BookUpsert = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim() === '' ? null : genre.trim(),
      publishedYear: yearNum,
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">
        Title *
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
      </label>

      <label className="label">
        Author *
        <input className="input" value={author} onChange={e => setAuthor(e.target.value)} />
      </label>

      <label className="label">
        Genre
        <input className="input" value={genre} onChange={e => setGenre(e.target.value)} />
      </label>

      <label className="label">
        Published year
        <input
          className="input"
          value={publishedYear}
          onChange={e => setPublishedYear(e.target.value)}
          placeholder="e.g. 2008"
        />
      </label>

      <div className="row gap">
        <button className="btn primary" type="submit">{submitLabel}</button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
