using BookLogApi.Data;
using BookLogApi.DTOs.Books;
using BookLogApi.DTOs.MyBooks;
using BookLogApi.Helpers;
using BookLogApi.Models;
using BookLogApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Controllers;

// MyBooksController.cs
// This controller is for the user’s personal reading list (MyBooks).
// It lets the user add a book to their list and set status like WantToRead / Reading / Finished.
// The endpoints are protected, so it uses the logged-in user info from the JWT token.
// It basically connects the “MyBooks” page in the frontend with the database.


[ApiController]
[Authorize]
[Route("api/mybooks")]
public class MyBooksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MyBooksController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MyBookDto>>> GetMine()
    {
        var userId = User.GetUserId();

        var items = await _db.MyBooks
            .Where(x => x.UserId == userId)
            .Include(x => x.Book)
            .OrderByDescending(x => x.Id)
            .Select(x => new MyBookDto
            {
                Id = x.Id,
                BookId = x.BookId,
                Status = x.Status.ToString(),
                Book = new BookDto
                {
                    Id = x.Book!.Id,
                    Title = x.Book.Title,
                    AuthorName = x.Book.AuthorName,
                    Genre = x.Book.Genre,
                    Description = x.Book.Description,
                    CoverImageUrl = x.Book.CoverImageUrl,   
                    Status = x.Book.Status.ToString(),
                    CreatedByUserId = x.Book.CreatedByUserId
                }
            })
            .ToListAsync();

        return Ok(items);
    }

    // PUT /api/mybooks/{bookId}  body: { status: "Reading" }
    [HttpPut("{bookId:int}")]
    public async Task<ActionResult<MyBookDto>> SetStatus(int bookId, SetMyBookStatusDto dto)
    {
        var userId = User.GetUserId();

        var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == bookId);
        if (book == null) return NotFound("Book not found.");

        var ok = Enum.TryParse<MyBookStatus>(dto.Status, true, out var status);
        if (!ok) status = MyBookStatus.WantToRead;

        var existing = await _db.MyBooks.FirstOrDefaultAsync(x => x.UserId == userId && x.BookId == bookId);

        if (existing == null)
        {
            existing = new MyBook
            {
                UserId = userId,
                BookId = bookId,
                Status = status
            };
            _db.MyBooks.Add(existing);
        }
        else
        {
            existing.Status = status;
        }

        await _db.SaveChangesAsync();

        return Ok(new MyBookDto
        {
            Id = existing.Id,
            BookId = existing.BookId,
            Status = existing.Status.ToString(),
            Book = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                AuthorName = book.AuthorName,
                Genre = book.Genre,
                Description = book.Description,
                CoverImageUrl = book.CoverImageUrl,      
                Status = book.Status.ToString(),
                CreatedByUserId = book.CreatedByUserId
            }
        });
    }

    [HttpDelete("{bookId:int}")]
    public async Task<IActionResult> Remove(int bookId)
    {
        var userId = User.GetUserId();

        var existing = await _db.MyBooks.FirstOrDefaultAsync(x => x.UserId == userId && x.BookId == bookId);
        if (existing == null) return NotFound();

        _db.MyBooks.Remove(existing);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
