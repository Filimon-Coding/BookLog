// src/api/myBooksApi.ts
import { http } from "./http";
import type { BookStatus, MyBookDto } from "../types/models";

export async function getMyBooksApi(): Promise<MyBookDto[]> {
  const res = await http.get<MyBookDto[]>("/mybooks");
  return res.data;
}

// This matches backend PUT /api/mybooks/{bookId}
// It creates if missing, updates if exists.
export async function setMyBookStatusApi(bookId: number, status: BookStatus): Promise<MyBookDto> {
  const res = await http.put<MyBookDto>(`/mybooks/${bookId}`, { status });
  return res.data;
}

export async function removeFromMyBooksApi(bookId: number): Promise<void> {
  await http.delete(`/mybooks/${bookId}`);
}

// Convenience helper for the Browse page
export async function addToMyBooksApi(bookId: number): Promise<MyBookDto> {
  return setMyBookStatusApi(bookId, "WantToRead");
}
