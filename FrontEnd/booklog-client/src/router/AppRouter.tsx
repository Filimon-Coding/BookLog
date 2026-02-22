import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BooksPage from "../pages/BooksPage";
import BookDetailsPage from "../pages/BookDetailsPage";
import MyBooksPage from "../pages/MyBooksPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminBooksPage from "../pages/AdminBooksPage";
import AuthorBooksPage from "../pages/AuthorBooksPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

// AppRouter.tsx
// This file is basically the “map” for all pages in the app (which URL opens which page).
// It also uses ProtectedRoute on some routes to check if the user is logged in and has the right role.

export default function AppRouter() {
  return (
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/books/:id" element={<BookDetailsPage />} /> 

      <Route
        path="/mybooks"
        element={
          <ProtectedRoute roles={["Admin", "Reader", "Author"]}>
            <MyBooksPage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin/books"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <AdminBooksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/author/books"
        element={
          <ProtectedRoute roles={["Author"]}>
            <AuthorBooksPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
