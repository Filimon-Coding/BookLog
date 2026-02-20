# File Tree: BookLog

**Generated:** 2/14/2026, 5:11:29 PM
**Root Path:** `/home/neov/Documents/MinCodingLinuxV/Prosjekter/5thSemester/ITPE3200Webapplikasjoner/BookLog`

```
├── 📁 .github
│   └── 📁 appmod
│       └── 📁 appcat
├── 📁 BackEnd
│   ├── 📁 BookLogApi
│   │   ├── 📁 BookLogApi.Tests
│   │   │   ├── 📄 BookLogApi.Tests.csproj
│   │   │   ├── 📄 BooksControllerTests.cs
│   │   │   └── 📄 GlobalUsings.cs
│   │   ├── 📁 Controllers
│   │   │   ├── 📄 AuthController.cs
│   │   │   ├── 📄 BooksController.cs
│   │   │   ├── 📄 CommentsController.cs
│   │   │   ├── 📄 MyBooksController.cs
│   │   │   └── 📄 UploadsController.cs
│   │   ├── 📁 DTOs
│   │   │   ├── 📁 Auth
│   │   │   │   ├── 📄 AuthResponseDto.cs
│   │   │   │   ├── 📄 LoginRequestDto.cs
│   │   │   │   ├── 📄 RegisterRequestDto.cs
│   │   │   │   └── 📄 UserDto.cs
│   │   │   ├── 📁 Books
│   │   │   │   ├── 📄 BookDto.cs
│   │   │   │   ├── 📄 CreateBookDto.cs
│   │   │   │   └── 📄 UpdateBookDto.cs
│   │   │   ├── 📁 Comments
│   │   │   │   ├── 📄 CommentDto.cs
│   │   │   │   ├── 📄 CreateCommentDto.cs
│   │   │   │   └── 📄 UpdateCommentDto.cs
│   │   │   └── 📁 MyBooks
│   │   │       ├── 📄 MyBookDto.cs
│   │   │       └── 📄 SetMyBookStatusDto.cs
│   │   ├── 📁 Data
│   │   │   ├── 📁 Seed
│   │   │   │   └── 📄 DbSeeder.cs
│   │   │   └── 📄 ApplicationDbContext.cs
│   │   ├── 📁 Helpers
│   │   │   └── 📄 ClaimsPrincipalExtensions.cs
│   │   ├── 📁 Migrations
│   │   │   ├── 📄 20260130181721_InitialCreate.Designer.cs
│   │   │   ├── 📄 20260130181721_InitialCreate.cs
│   │   │   ├── 📄 20260131084304_AddCoverImageUrlToBook.Designer.cs
│   │   │   ├── 📄 20260131084304_AddCoverImageUrlToBook.cs
│   │   │   └── 📄 ApplicationDbContextModelSnapshot.cs
│   │   ├── 📁 Properties
│   │   │   └── ⚙️ launchSettings.json
│   │   ├── 📁 Services
│   │   │   └── 📄 JwtTokenService.cs
│   │   ├── 📁 models
│   │   │   ├── 📁 Enums
│   │   │   │   ├── 📄 BookVisibilityStatus.cs
│   │   │   │   └── 📄 MyBookStatus.cs
│   │   │   ├── 📄 ApplicationUser.cs
│   │   │   ├── 📄 Book.cs
│   │   │   ├── 📄 Comment.cs
│   │   │   └── 📄 myBook.cs
│   │   ├── 📁 wwwroot
│   │   │   └── 📁 uploads
│   │   │       ├── 🖼️ 0f8b784bf5aa42eb8b814bf95ffdd443.jpeg
│   │   │       ├── 🖼️ 1984.jpg
│   │   │       ├── 🖼️ 282cb0327da44c178e06fb490d29563e.jpg
│   │   │       ├── 🖼️ 2f4e14c02f1442918b59287ccb187639.jpg
│   │   │       ├── 🖼️ 459b1cf2fedd4ab5927702877706121c.jpeg
│   │   │       ├── 🖼️ 5f57aa62164b4684980f6c14198f7da4.jpeg
│   │   │       ├── 🖼️ 67e99112f62f43daba8ae3142012a835.png
│   │   │       ├── 🖼️ 6ec96fa16f9a437ea097be6a19dc8f66.jpeg
│   │   │       ├── 🖼️ 7dc9bd572ac842479774953cd4c7b0c2.jpeg
│   │   │       ├── 🖼️ 8544600983594d9c8ba0c9d3b6548981.jpg
│   │   │       ├── 🖼️ 950574cedbce4be487b58316854b498f.png
│   │   │       ├── 🖼️ Cleancode.jpeg
│   │   │       ├── 🖼️ a5380967d55944d697f3b4625efb9b26.jpeg
│   │   │       ├── 🖼️ b02a9b69cae14234b614b057ddb3991f.jpeg
│   │   │       ├── 🖼️ b6e0413b96484b0e87e897f30bbf1bf0.png
│   │   │       ├── 🖼️ bb8de9539d7743ebaf89cccfd68f29f6.jpg
│   │   │       ├── 🖼️ d4cbdc4728ed46cb96ffb1a762bf867d.jpg
│   │   │       ├── 🖼️ d6e9481bfa03497599f88a92e12a419e.png
│   │   │       ├── 🖼️ d77f3ee60e344031afe5de7c8d53bc4e.jpeg
│   │   │       ├── 🖼️ df0f0495d06e451da2c2b48cabade2c6.jpeg
│   │   │       └── 🖼️ pragmatic-programmer-the.jpg
│   │   ├── 📄 BookLogApi.csproj
│   │   ├── 📄 BookLogApi.http
│   │   ├── 📄 Program.cs
│   │   ├── ⚙️ appsettings.Development.json
│   │   ├── ⚙️ appsettings.json
│   │   └── 📄 booklog.db
│   └── 📄 fil.txt
├── 📁 FrontEnd
│   └── 📁 booklog-client
│       ├── 📁 public
│       │   ├── 🖼️ favicon.svg
│       │   └── 🖼️ vite.svg
│       ├── 📁 src
│       │   ├── 📁 api
│       │   │   ├── 📄 authApi.ts
│       │   │   ├── 📄 booksApi.ts
│       │   │   ├── 📄 commentsApi.ts
│       │   │   ├── 📄 http.ts
│       │   │   ├── 📄 myBooksApi.ts
│       │   │   └── 📄 uploadsApi.ts
│       │   ├── 📁 assets
│       │   │   └── 🖼️ react.svg
│       │   ├── 📁 components
│       │   │   ├── 📄 BookCard.tsx
│       │   │   ├── 📄 BookFilters.tsx
│       │   │   ├── 📄 BookForm.tsx
│       │   │   ├── 📄 CommentForm.tsx
│       │   │   ├── 📄 CommentList.tsx
│       │   │   └── 📄 Navbar.tsx
│       │   ├── 📁 context
│       │   │   ├── 📄 AuthContext.tsx
│       │   │   └── 📄 ThemeContext.tsx
│       │   ├── 📁 pages
│       │   │   ├── 📄 AdminBooksPage.tsx
│       │   │   ├── 📄 AuthorBooksPage.tsx
│       │   │   ├── 📄 BookDetailsPage.tsx
│       │   │   ├── 📄 BooksPage.tsx
│       │   │   ├── 📄 HomePage.tsx
│       │   │   ├── 📄 LoginPage.tsx
│       │   │   ├── 📄 MyBooksPage.tsx
│       │   │   ├── 📄 NotFoundPage.tsx
│       │   │   └── 📄 RegisterPage.tsx
│       │   ├── 📁 router
│       │   │   ├── 📄 AppRouter.tsx
│       │   │   └── 📄 ProtectedRoute.tsx
│       │   ├── 📁 types
│       │   │   └── 📄 models.ts
│       │   ├── 📁 utils
│       │   │   └── 📄 resolveAssetUrl.ts
│       │   ├── 🎨 App.css
│       │   ├── 📄 App.tsx
│       │   ├── 🎨 index.css
│       │   └── 📄 main.tsx
│       ├── ⚙️ .gitignore
│       ├── 📝 README.md
│       ├── 📄 eslint.config.js
│       ├── 🌐 index.html
│       ├── ⚙️ package-lock.json
│       ├── ⚙️ package.json
│       ├── ⚙️ tsconfig.app.json
│       ├── ⚙️ tsconfig.json
│       ├── ⚙️ tsconfig.node.json
│       └── 📄 vite.config.ts
├── 📄 BookLog.sln
├── 📝 Documentation.md
├── 📝 README.md
└── 🖼️ image.png
```

---
*Generated by FileTree Pro Extension*