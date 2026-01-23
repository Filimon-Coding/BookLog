namespace BookLogApi.Models;

public class Comment
{
    public int Id { get; set; }

    public int BookId { get; set; }
    public Book? Book { get; set; }

    public string UserName { get; set; } = "";
    public string Text { get; set; } = "";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
