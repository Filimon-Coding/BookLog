import { Book, BookUpsert, Comment, CommentCreate } from '../types';
import { httpDelete, httpGet, httpPost, httpPut } from './http';

const BASE = '/api/books';

export const booksApi = {
  getAll(): Promise<Book[]> {
    return httpGet<Book[]>(BASE);
  },

  getById(id: number): Promise<Book> {
    return httpGet<Book>(`${BASE}/${id}`);
  },

  create(payload: BookUpsert): Promise<Book> {
    return httpPost<Book>(BASE, payload);
  },

  update(id: number, payload: BookUpsert): Promise<Book> {
    return httpPut<Book>(`${BASE}/${id}`, payload);
  },

  remove(id: number): Promise<void> {
    return httpDelete(`${BASE}/${id}`);
  },

  /**
   * Comments endpoint can differ depending on your controller.
   * This tries: POST /api/books/{id}/comments
   *
   * If your backend instead uses POST /api/comments with { bookId, userName, text },
   * then replace this function implementation accordingly.
   */
  addComment(bookId: number, payload: CommentCreate): Promise<Comment> {
    return httpPost<Comment>(`${BASE}/${bookId}/comments`, payload);
  },
};
