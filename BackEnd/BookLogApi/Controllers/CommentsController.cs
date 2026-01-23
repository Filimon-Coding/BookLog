using BookLogApi.Data;
using BookLogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Controllers;

[ApiController]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<CommentsController> _logger;

    public CommentsController(AppDbContext db, ILogger<CommentsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet("api/books/{bookId:int}/comments")]
    public async Task<IActionResult> GetForBook(int bookId)
    {
        var exists = await _db.Books.AnyAsync(b => b.Id == bookId);
        if (!exists) return NotFound(new { message = "Book not found." });

        var comments = await _db.Comments
            .Where(c => c.BookId == bookId)
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost("api/books/{bookId:int}/comments")]
    public async Task<IActionResult> Add(int bookId, [FromBody] Comment comment)
    {
        var exists = await _db.Books.AnyAsync(b => b.Id == bookId);
        if (!exists) return NotFound(new { message = "Book not found." });

        if (string.IsNullOrWhiteSpace(comment.UserName))
            return BadRequest(new { message = "UserName is required." });

        if (string.IsNullOrWhiteSpace(comment.Text))
            return BadRequest(new { message = "Text is required." });

        comment.BookId = bookId;
        comment.CreatedAtUtc = DateTime.UtcNow;

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        return Ok(comment);
    }

    [HttpDelete("api/comments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);
        if (existing == null) return NotFound();

        _db.Comments.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
