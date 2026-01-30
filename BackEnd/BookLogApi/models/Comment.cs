namespace BookLogApi.Models;

public class Comment
{
    public int Id { get; set; }

    public int BookId { get; set; }
    public Book? Book { get; set; }

    public int UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
