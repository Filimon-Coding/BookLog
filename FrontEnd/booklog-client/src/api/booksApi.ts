import { http } from "./http";
import type { BookDto } from "../types/models";

export async function getBooksApi() {
  const res = await http.get<BookDto[]>("/books");
  return res.data;
}

export async function getBookByIdApi(id: number) {
  const res = await http.get<BookDto>(`/books/${id}`);
  return res.data;
}

// Admin + Author
export async function createBookApi(book: Partial<BookDto>) {
  const res = await http.post<BookDto>("/books", book);
  return res.data;
}

export async function updateBookApi(id: number, book: Partial<BookDto>) {
  const res = await http.put<BookDto>(`/books/${id}`, book);
  return res.data;
}

export async function deleteBookApi(id: number) {
  await http.delete(`/books/${id}`);
}
