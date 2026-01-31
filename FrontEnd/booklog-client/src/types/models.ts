// src/types/models.ts

export type Role = "Admin" | "Author" | "Reader";

export type BookVisibilityStatus = "Published" | "Hidden";

export type BookStatus = "WantToRead" | "Reading" | "Finished";
export type MyBookStatus = BookStatus;

export type UserDto = {
  id: number;
  username: string;
  role: Role;
};

// IMPORTANT: backend/frontend may use either token or accessToken
export type AuthResponseDto = {
  token?: string;
  accessToken?: string;
  user: UserDto;
};

export type BookDto = {
  id: number;
  title: string;
  authorName: string;
  genre: string;
  description: string;
  status: BookVisibilityStatus;
  createdByUserId: number;
};

export type CommentDto = {
  id: number;
  bookId: number;
  content: string;
  createdAt: string;
  username: string;
  userId: number;
};

export type MyBookDto = {
  id: number;
  bookId: number;
  status: BookStatus;
  book: BookDto;
};
