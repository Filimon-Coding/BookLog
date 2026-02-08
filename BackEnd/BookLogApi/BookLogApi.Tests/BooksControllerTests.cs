

using System.Security.Claims;
using BookLogApi.Controllers;
using BookLogApi.Data;
using BookLogApi.DTOs.Books;
using BookLogApi.Models;
using BookLogApi.Models.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BookLogApi.Tests;

public class BooksControllerTests
{
    // -----------------------------
    // Helpers
    // -----------------------------

    private static ApplicationDbContext BuildDb(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static BooksController BuildControllerWithUser(ApplicationDbContext db, int userId, params string[] roles)
    {
        var controller = new BooksController(db);

        // Put multiple claim types to match whatever your User.GetUserId() extension expects.
        // (Common ones: NameIdentifier, "sub", "id".)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("sub", userId.ToString()),
            new Claim("id", userId.ToString()),
        };

        foreach (var r in roles)
            claims.Add(new Claim(ClaimTypes.Role, r));

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        return controller;
    }

    private static async Task<Book> SeedBookAsync(ApplicationDbContext db, string title, int createdByUserId)
    {
        var b = new Book
        {
            Title = title,
            AuthorName = "Some Author",
            Genre = "Fantasy",
            Description = "Desc",
            CoverImageUrl = "/uploads/x.png",
            Status = BookVisibilityStatus.Published,
            CreatedByUserId = createdByUserId
        };

        db.Books.Add(b);
        await db.SaveChangesAsync();
        return b;
    }

    // -----------------------------
    // A) Positive test cases
    // -----------------------------

    [Fact]
    public async Task GetAll_ReturnsBooksSortedByIdDesc()
    {
        var db = BuildDb(nameof(GetAll_ReturnsBooksSortedByIdDesc));
        await SeedBookAsync(db, "B1", 10);
        await SeedBookAsync(db, "B2", 10);
        await SeedBookAsync(db, "B3", 10);

        var controller = BuildControllerWithUser(db, userId: 10, "Reader");

        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var books = Assert.IsType<List<BookDto>>(ok.Value);

        Assert.True(books.Count >= 3);

        // Ensure descending by Id
        for (int i = 0; i < books.Count - 1; i++)
            Assert.True(books[i].Id > books[i + 1].Id);
    }

    [Fact]
    public async Task GetById_ExistingBook_ReturnsBook()
    {
        var db = BuildDb(nameof(GetById_ExistingBook_ReturnsBook));
        var seeded = await SeedBookAsync(db, "Hello", 10);

        var controller = BuildControllerWithUser(db, userId: 10, "Reader");

        var result = await controller.GetById(seeded.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<BookDto>(ok.Value);

        Assert.Equal(seeded.Id, dto.Id);
        Assert.Equal("Hello", dto.Title);
    }

    [Fact]
    public async Task Create_AsAdminOrAuthor_CreatesBookAndSetsCreatedByUserId()
    {
        var db = BuildDb(nameof(Create_AsAdminOrAuthor_CreatesBookAndSetsCreatedByUserId));

        var controller = BuildControllerWithUser(db, userId: 77, "Author");

        var dto = new CreateBookDto
        {
            Title = "New Book",
            AuthorName = "Me",
            Genre = "Sci-Fi",
            Description = "Test",
            CoverImageUrl = "/uploads/new.png",
            Status = "Published"
        };

        var result = await controller.Create(dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var createdDto = Assert.IsType<BookDto>(ok.Value);

        // Returned DTO should have CreatedByUserId = logged in user
        Assert.Equal(77, createdDto.CreatedByUserId);

        // DB should contain it with same CreatedByUserId
        var inDb = await db.Books.FirstOrDefaultAsync(b => b.Id == createdDto.Id);
        Assert.NotNull(inDb);
        Assert.Equal(77, inDb!.CreatedByUserId);
    }

    [Fact]
    public async Task Update_AsAdmin_UpdatesAnyBook()
    {
        var db = BuildDb(nameof(Update_AsAdmin_UpdatesAnyBook));
        var seeded = await SeedBookAsync(db, "Old", createdByUserId: 123);

        var controller = BuildControllerWithUser(db, userId: 999, "Admin");

        var dto = new UpdateBookDto
        {
            Title = "Updated",
            AuthorName = "New Author",
            Genre = "Drama",
            Description = "New Desc",
            CoverImageUrl = "/uploads/y.png",
            Status = "Hidden"
        };

        var result = await controller.Update(seeded.Id, dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var updatedDto = Assert.IsType<BookDto>(ok.Value);

        Assert.Equal("Updated", updatedDto.Title);
        Assert.Equal("Hidden", updatedDto.Status);

        var inDb = await db.Books.FirstAsync(b => b.Id == seeded.Id);
        Assert.Equal("Updated", inDb.Title);
        Assert.Equal(BookVisibilityStatus.Hidden, inDb.Status);
    }

    [Fact]
    public async Task Update_AsAuthorOwner_UpdatesOwnBook()
    {
        var db = BuildDb(nameof(Update_AsAuthorOwner_UpdatesOwnBook));
        var seeded = await SeedBookAsync(db, "Mine", createdByUserId: 50);

        var controller = BuildControllerWithUser(db, userId: 50, "Author");

        var dto = new UpdateBookDto
        {
            Title = "Mine Updated",
            AuthorName = "Owner",
            Genre = "Horror",
            Description = "Owner update",
            CoverImageUrl = "/uploads/z.png",
            Status = "Published"
        };

        var result = await controller.Update(seeded.Id, dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var updated = Assert.IsType<BookDto>(ok.Value);

        Assert.Equal("Mine Updated", updated.Title);
    }

    [Fact]
    public async Task Delete_AsAdmin_DeletesBook_ReturnsNoContent()
    {
        var db = BuildDb(nameof(Delete_AsAdmin_DeletesBook_ReturnsNoContent));
        var seeded = await SeedBookAsync(db, "DeleteMe", createdByUserId: 10);

        var controller = BuildControllerWithUser(db, userId: 1, "Admin");

        var result = await controller.Delete(seeded.Id);

        Assert.IsType<NoContentResult>(result);

        var stillThere = await db.Books.AnyAsync(b => b.Id == seeded.Id);
        Assert.False(stillThere);
    }

    // -----------------------------
    // B) Negative test cases
    // -----------------------------

    [Fact]
    public async Task GetById_UnknownId_ReturnsNotFound()
    {
        var db = BuildDb(nameof(GetById_UnknownId_ReturnsNotFound));
        var controller = BuildControllerWithUser(db, userId: 10, "Reader");

        var result = await controller.GetById(99999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Update_UnknownId_ReturnsNotFound()
    {
        var db = BuildDb(nameof(Update_UnknownId_ReturnsNotFound));
        var controller = BuildControllerWithUser(db, userId: 10, "Admin");

        var dto = new UpdateBookDto
        {
            Title = "X",
            AuthorName = "Y",
            Genre = "Z",
            Description = "D",
            CoverImageUrl = "/uploads/a.png",
            Status = "Published"
        };

        var result = await controller.Update(99999, dto);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Update_AsAuthorNotOwner_ReturnsForbid()
    {
        var db = BuildDb(nameof(Update_AsAuthorNotOwner_ReturnsForbid));
        var seeded = await SeedBookAsync(db, "Not Mine", createdByUserId: 111);

        var controller = BuildControllerWithUser(db, userId: 222, "Author");

        var dto = new UpdateBookDto
        {
            Title = "Hacked",
            AuthorName = "Nope",
            Genre = "Nope",
            Description = "Nope",
            CoverImageUrl = "/uploads/nope.png",
            Status = "Published"
        };

        var result = await controller.Update(seeded.Id, dto);

        Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task Delete_AsAuthorNotOwner_ReturnsForbid()
    {
        var db = BuildDb(nameof(Delete_AsAuthorNotOwner_ReturnsForbid));
        var seeded = await SeedBookAsync(db, "Not Mine", createdByUserId: 111);

        var controller = BuildControllerWithUser(db, userId: 222, "Author");

        var result = await controller.Delete(seeded.Id);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Create_InvalidStatus_FallsBackToPublished()
    {
        var db = BuildDb(nameof(Create_InvalidStatus_FallsBackToPublished));
        var controller = BuildControllerWithUser(db, userId: 77, "Author");

        var dto = new CreateBookDto
        {
            Title = "Enum Test",
            AuthorName = "Me",
            Genre = "Test",
            Description = "Test",
            CoverImageUrl = "/uploads/test.png",
            Status = "THIS_IS_NOT_A_REAL_ENUM"
        };

        var result = await controller.Create(dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var created = Assert.IsType<BookDto>(ok.Value);

        Assert.Equal("Published", created.Status);

        var inDb = await db.Books.FirstAsync(b => b.Id == created.Id);
        Assert.Equal(BookVisibilityStatus.Published, inDb.Status);
    }
}
