import type { CommentDto } from "../types/models";
import { http } from "./http";

export async function getCommentsForBookApi(bookId: number): Promise<CommentDto[]> {
  const res = await http.get<CommentDto[]>(`/books/${bookId}/comments`);
  return res.data;
}

export async function addCommentApi(bookId: number, content: string): Promise<CommentDto> {
  const res = await http.post<CommentDto>(`/books/${bookId}/comments`, { content });
  return res.data;
}

export async function updateCommentApi(commentId: number, content: string): Promise<CommentDto> {
  const res = await http.put<CommentDto>(`/comments/${commentId}`, { content });
  return res.data;
}

export async function deleteCommentApi(commentId: number): Promise<void> {
  await http.delete(`/comments/${commentId}`);
}
