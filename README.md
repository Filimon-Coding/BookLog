# BookLog (ITEP3200 Resit Web App)

BookLog is a web-based book review platform where users can browse books, maintain a personal reading list (MyBooks), and post comments on books. Authors and admins can create, update, and delete book records. The application is built as a .NET 8 Web API backend with a React (Vite) frontend.

---

## Tech Stack

### Backend
- .NET 8 Web API
- Entity Framework Core (SQLite)
- ASP.NET Core Identity (roles and users)
- JWT Bearer Authentication
- Static file hosting for uploaded book covers (`wwwroot/uploads`)
- Swagger / OpenAPI for API exploration

### Frontend
- React + TypeScript (Vite)
- Axios for HTTP requests
- React Router for client-side routing
- Custom auth context + protected routes

---

## Key Features

- Authentication with JWT tokens
- Role-based access control:
  - Admin: manage all books and moderate (delete) comments
  - Author: create/update/delete own books
  - Reader: browse books, manage MyBooks, comment
- CRUD for books
- Comments on books
- MyBooks (WantToRead / Reading / Finished)
- Cover image upload for books (stored in backend `wwwroot/uploads`)

---

## Repository Structure

### Root (high-level)
- `BackEnd/BookLogApi/`  
  .NET Web API project (controllers, EF Core, Identity, JWT, SQLite)
- `FrontEnd/booklog-client/`  
  React client (pages, components, API modules, routing, auth context)

---

## Backend Structure (BackEnd/BookLogApi)

Typical layout:

- `Controllers/`
  - `BooksController.cs`  
    CRUD endpoints for books
  - `MyBooksController.cs`  
    Personal reading list endpoints (requires authentication)
  - `UploadsController.cs`  
    Upload endpoint for cover images (Admin/Author)
  - `CommentsController.cs` (present in project)  
    Comment endpoints (book comments + delete)

- `Data/`
  - `ApplicationDbContext.cs` (EF Core DbContext)
  - `Seed/DbSeeder.cs` (creates DB and seed roles/users)

- `Models/`
  - `Book.cs`, `Comment.cs`, `MyBook.cs`, `ApplicationUser.cs`
  - `Enums/` (visibility status, reading status)

- `DTOs/`
  - `Books/` (BookDto, CreateBookDto, UpdateBookDto)
  - `MyBooks/` (MyBookDto, SetMyBookStatusDto)
  - Auth DTOs (login/register responses)

- `Services/`
  - `JwtTokenService.cs` (JWT creation)

- `wwwroot/uploads/`
  - Storage folder for uploaded cover images

### Backend Runtime Behavior
- Database is SQLite.
- `Program.cs` runs migrations at startup and seeds roles/users:
  - EF Core migrations are applied automatically.
  - Seeder creates roles (Admin, Author, Reader) and any default accounts defined by `DbSeeder`.

---

## Frontend Structure (FrontEnd/booklog-client)

- `src/api/`
  - `http.ts`  
    Axios instance. Reads `VITE_API_BASE_URL` and attaches JWT token from `localStorage` to requests.
  - `authApi.ts`  
    Login/register requests.
  - `booksApi.ts`  
    Book CRUD requests.
  - `myBooksApi.ts`  
    MyBooks reading-status requests.
  - `commentsApi.ts`  
    Fetch/add/delete comments.
  - `uploadsApi.ts` (added for cover upload)  
    Multipart cover upload for Admin/Author.

- `src/context/`
  - `AuthContext.tsx`  
    Stores logged-in user and token, provides login/logout helpers.

- `src/router/`
  - `AppRouter.tsx`  
    Defines routes.
  - `ProtectedRoute.tsx`  
    Guards pages requiring auth/roles.

- `src/pages/`
  - `HomePage.tsx`  
    Landing page + trending section.
  - `BooksPage.tsx`  
    Browse/search/filter books.
  - `BookDetailsPage.tsx`  
    Single book view + comments.
  - `MyBooksPage.tsx`  
    Personal reading list.
  - `AdminBooksPage.tsx`  
    Admin book management UI.
  - `AuthorBooksPage.tsx`  
    Author book management UI.
  - `LoginPage.tsx`, `RegisterPage.tsx`
  - `NotFoundPage.tsx`

- `src/components/`
  - `NavBar.tsx`  
    Navigation + search suggestions.
  - `BookCard.tsx`  
    Book list card (supports cover images).
  - `BookForm.tsx`  
    Create/edit form (supports cover upload + preview).
  - `BookFilters.tsx`
  - `CommentList.tsx`, `CommentForm.tsx`

- `src/utils/`
  - `resolveAssetUrl.ts`  
    Converts `"/uploads/xyz.png"` into a usable URL (important when API base is absolute).

---

## Environment Configuration

### Frontend `.env`
The frontend reads the API base URL from:

- `FrontEnd/booklog-client/.env`
- `VITE_API_BASE_URL`

Example:
```env
VITE_API_BASE_URL=http://localhost:5040/api
