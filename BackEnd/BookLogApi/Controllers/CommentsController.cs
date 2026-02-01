using BookLogApi.Data;
using BookLogApi.DTOs.Comments;
using BookLogApi.Helpers;
using BookLogApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Controllers;

[ApiController]
[Route("api")]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CommentsController(ApplicationDbContext db)
    {
        _db = db;
    }

    // GET /api/books/{bookId}/comments
    [HttpGet("books/{bookId:int}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetForBook(int bookId)
    {
        var comments = await _db.Comments
            .Where(c => c.BookId == bookId)
            .Include(c => c.User)
            .OrderByDescending(c => c.Id)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                BookId = c.BookId,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                Username = c.User!.UserName ?? "",
                UserId = c.UserId
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST /api/books/{bookId}/comments  (only logged in)
    [Authorize]
    [HttpPost("books/{bookId:int}/comments")]
    public async Task<ActionResult<CommentDto>> Add(int bookId, CreateCommentDto dto)
    {
        var text = (dto.Content ?? "").Trim();
        if (string.IsNullOrWhiteSpace(text))
            return BadRequest("Content is required.");

        var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == bookId);
        if (book == null) return NotFound("Book not found.");

        var userId = User.GetUserId();

        var comment = new Comment
        {
            BookId = bookId,
            UserId = userId,
            Content = text,
            CreatedAt = DateTime.UtcNow
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FirstAsync(u => u.Id == userId);

        return Ok(new CommentDto
        {
            Id = comment.Id,
            BookId = comment.BookId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            Username = user.UserName ?? "",
            UserId = comment.UserId
        });
    }

    // PUT /api/comments/{id}  (owner can edit own comment, admin can edit any if you want)
    // NOTE: Requirement says user/author can edit own comments. Admin edit not required,
    // but allowing admin edit is harmless. If you want to block admin edit, remove isAdmin check.
    [Authorize]
    [HttpPut("comments/{id:int}")]
    public async Task<ActionResult<CommentDto>> Update(int id, UpdateCommentDto dto)
    {
        var text = (dto.Content ?? "").Trim();
        if (string.IsNullOrWhiteSpace(text))
            return BadRequest("Content is required.");

        var comment = await _db.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null) return NotFound();

        var userId = User.GetUserId();
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && comment.UserId != userId)
            return Forbid();

        comment.Content = text;
        await _db.SaveChangesAsync();

        return Ok(new CommentDto
        {
            Id = comment.Id,
            BookId = comment.BookId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            Username = comment.User?.UserName ?? "",
            UserId = comment.UserId
        });
    }

    // DELETE /api/comments/{id}
    // - owner can delete own comment
    // - admin can delete any comment
    [Authorize]
    [HttpDelete("comments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);
        if (comment == null) return NotFound();

        var userId = User.GetUserId();
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && comment.UserId != userId)
            return Forbid();

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
