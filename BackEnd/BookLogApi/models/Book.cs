using BookLogApi.Models.Enums;

namespace BookLogApi.Models;

public class Book
{
    public int Id { get; set; }

    public string Title { get; set; } = "";
    public string AuthorName { get; set; } = "";
    public string? Genre { get; set; }
    public string? Description { get; set; }

    // image 
    public string? CoverImageUrl { get; set; }

    public BookVisibilityStatus Status { get; set; } = BookVisibilityStatus.Published;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Ownership (Author can only modify own books)
    public int CreatedByUserId { get; set; }
    public ApplicationUser? CreatedByUser { get; set; }

    public List<Comment> Comments { get; set; } = new();
}
