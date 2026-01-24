export type Role = "Admin" | "Reader" | "Author";

export type UserDto = {
  id: number;
  username: string;
  role: Role;
};

export type AuthResponseDto = {
  accessToken: string;
  user: UserDto;
};

export type BookStatus = "WantToRead" | "Reading" | "Finished";

export type BookDto = {
  id: number;
  title: string;
  authorName: string;
  genre?: string;
  status?: string; // optional if your backend stores a book status; MyBooks uses BookStatus instead
  description?: string;
  createdByUserId?: number; // needed for Author "own books"
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
