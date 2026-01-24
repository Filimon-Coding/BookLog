export type Comment = {
  id: number;
  bookId: number;
  userName: string;
  text: string;
  createdAtUtc: string;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  genre?: string | null;
  publishedYear?: number | null;
  comments?: Comment[];
};

// Payloads for create/update (matches your model fields)
export type BookUpsert = {
  title: string;
  author: string;
  genre?: string | null;
  publishedYear?: number | null;
};

export type CommentCreate = {
  userName: string;
  text: string;
};
