import type { BookDto } from "../types/models";
import { http } from "./http";

export async function getBooksApi(): Promise<BookDto[]> {
  const res = await http.get<BookDto[]>("/books");
  return res.data;
}

export async function getBookByIdApi(id: number): Promise<BookDto> {
  const res = await http.get<BookDto>(`/books/${id}`);
  return res.data;
}

export async function createBookApi(data: Partial<BookDto>): Promise<BookDto> {
  const res = await http.post<BookDto>("/books", data);
  return res.data;
}

export async function updateBookApi(id: number, data: Partial<BookDto>): Promise<void> {
  await http.put(`/books/${id}`, data);
}

export async function deleteBookApi(id: number): Promise<void> {
  await http.delete(`/books/${id}`);
}

/** Optional default export so *both* import styles work */
const booksApi = {
  getBooksApi,
  getBookByIdApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
};
export default booksApi;
