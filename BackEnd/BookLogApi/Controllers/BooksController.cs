using BookLogApi.Data;
using BookLogApi.DTOs.Books;
using BookLogApi.Helpers;
using BookLogApi.Models;
using BookLogApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Controllers;


// BooksController.cs
// This controller handles the main book 
// API (get/create/update/delete books) and talks to the database.

[ApiController]
[Route("api/books")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BooksController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<BookDto>>> GetAll()
    {
        var books = await _db.Books
            .OrderByDescending(b => b.Id)
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                AuthorName = b.AuthorName,
                Genre = b.Genre,
                Description = b.Description,
                CoverImageUrl = b.CoverImageUrl,   
                Status = b.Status.ToString(),
                CreatedByUserId = b.CreatedByUserId
            })
            .ToListAsync();

        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookDto>> GetById(int id)
    {
        var b = await _db.Books.FirstOrDefaultAsync(x => x.Id == id);
        if (b == null) return NotFound();

        return Ok(new BookDto
        {
            Id = b.Id,
            Title = b.Title,
            AuthorName = b.AuthorName,
            Genre = b.Genre,
            Description = b.Description,
            CoverImageUrl = b.CoverImageUrl,     
            Status = b.Status.ToString(),
            CreatedByUserId = b.CreatedByUserId
        });
    }

    [Authorize(Roles = "Admin,Author")]
    [HttpPost]
    public async Task<ActionResult<BookDto>> Create(CreateBookDto dto)
    {
        var userId = User.GetUserId();

        var statusOk = Enum.TryParse<BookVisibilityStatus>(dto.Status, true, out var status);
        if (!statusOk) status = BookVisibilityStatus.Published;

        var book = new Book
        {
            Title = dto.Title,
            AuthorName = dto.AuthorName,
            Genre = dto.Genre,
            Description = dto.Description,
            CoverImageUrl = dto.CoverImageUrl,   
            Status = status,
            CreatedByUserId = userId
        };

        _db.Books.Add(book);
        await _db.SaveChangesAsync();

        return Ok(new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            AuthorName = book.AuthorName,
            Genre = book.Genre,
            Description = book.Description,
            CoverImageUrl = book.CoverImageUrl,  
            Status = book.Status.ToString(),
            CreatedByUserId = book.CreatedByUserId
        });
    }

    [Authorize(Roles = "Admin,Author")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<BookDto>> Update(int id, UpdateBookDto dto)
    {
        var book = await _db.Books.FirstOrDefaultAsync(x => x.Id == id);
        if (book == null) return NotFound();

        var userId = User.GetUserId();
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && book.CreatedByUserId != userId)
            return Forbid();

        var statusOk = Enum.TryParse<BookVisibilityStatus>(dto.Status, true, out var status);
        if (!statusOk) status = BookVisibilityStatus.Published;

        book.Title = dto.Title;
        book.AuthorName = dto.AuthorName;
        book.Genre = dto.Genre;
        book.Description = dto.Description;
        book.CoverImageUrl = dto.CoverImageUrl; 
        book.Status = status;

        await _db.SaveChangesAsync();

        return Ok(new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            AuthorName = book.AuthorName,
            Genre = book.Genre,
            Description = book.Description,
            CoverImageUrl = book.CoverImageUrl,  
            Status = book.Status.ToString(),
            CreatedByUserId = book.CreatedByUserId
        });
    }

    [Authorize(Roles = "Admin,Author")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _db.Books.FirstOrDefaultAsync(x => x.Id == id);
        if (book == null) return NotFound();

        var userId = User.GetUserId();
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && book.CreatedByUserId != userId)
            return Forbid();

        _db.Books.Remove(book);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
