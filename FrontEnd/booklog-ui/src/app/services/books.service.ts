import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/books';
import { API_BASE_URL } from '../config/api';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private url = `${API_BASE_URL}/api/books`;

  constructor(private http: HttpClient) {}

  getAll(search?: string, genre?: string): Observable<Book[]> {
    let params = new HttpParams();
    if (search && search.trim().length > 0) params = params.set('search', search.trim());
    if (genre && genre.trim().length > 0) params = params.set('genre', genre.trim());

    return this.http.get<Book[]>(this.url, { params });
  }

  create(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.url, book);
  }

  update(id: number, book: Omit<Book, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
