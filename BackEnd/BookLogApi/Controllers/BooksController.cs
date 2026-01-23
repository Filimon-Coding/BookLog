using BookLogApi.Data;
using BookLogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<BooksController> _logger;

    public BooksController(AppDbContext db, ILogger<BooksController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? genre)
    {
        IQueryable<Book> q = _db.Books;

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(b => b.Title.Contains(search) || b.Author.Contains(search));

        if (!string.IsNullOrWhiteSpace(genre))
            q = q.Where(b => b.Genre == genre);

        var books = await q.OrderBy(b => b.Title).ToListAsync();
        return Ok(books);
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
        return book == null ? NotFound() : Ok(book);
    }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Book book)
        {
            if (string.IsNullOrWhiteSpace(book.Title))
                return BadRequest(new { message = "Title is required." });

            if (string.IsNullOrWhiteSpace(book.Author))
                return BadRequest(new { message = "Author is required." });

            try
            {
                _db.Books.Add(book);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create book.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Book book)
    {
        var existing = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
        if (existing == null) return NotFound();

        if (string.IsNullOrWhiteSpace(book.Title))
            return BadRequest(new { message = "Title is required." });

        if (string.IsNullOrWhiteSpace(book.Author))
            return BadRequest(new { message = "Author is required." });

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Genre = book.Genre;
        existing.PublishedYear = book.PublishedYear;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();

        _db.Books.Remove(book);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
