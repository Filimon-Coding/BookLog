import { http } from "./http";
import type { BookStatus, MyBookDto } from "../types/models";

export async function getMyBooksApi() {
  const res = await http.get<MyBookDto[]>("/mybooks");
  return res.data;
}

export async function setMyBookStatusApi(bookId: number, status: BookStatus) {
  const res = await http.put<MyBookDto>(`/mybooks/${bookId}`, { status });
  return res.data;
}

export async function removeFromMyBooksApi(bookId: number) {
  await http.delete(`/mybooks/${bookId}`);
}
