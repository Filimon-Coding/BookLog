import { http } from "./http";
import type { CommentDto } from "../types/models";

export async function getCommentsForBookApi(bookId: number) {
  const res = await http.get<CommentDto[]>(`/books/${bookId}/comments`);
  return res.data;
}

export async function addCommentApi(bookId: number, content: string) {
  const res = await http.post<CommentDto>(`/books/${bookId}/comments`, { content });
  return res.data;
}

// Admin delete any comment (and optionally owner delete if backend supports it)
export async function deleteCommentApi(commentId: number) {
  await http.delete(`/comments/${commentId}`);
}
