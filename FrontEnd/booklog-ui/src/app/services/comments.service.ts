
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { API_BASE_URL } from '../config/api';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private http: HttpClient) {}

  getForBook(bookId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_BASE_URL}/api/books/${bookId}/comments`);
  }

  add(bookId: number, payload: { userName: string; text: string }): Observable<Comment> {
    return this.http.post<Comment>(`${API_BASE_URL}/api/books/${bookId}/comments`, payload);
  }

  delete(commentId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/api/comments/${commentId}`);
  }
}
