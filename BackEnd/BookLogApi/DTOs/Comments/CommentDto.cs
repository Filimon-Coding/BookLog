namespace BookLogApi.DTOs.Comments;

public class CommentDto
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public int UserId { get; set; }

    public string Username { get; set; } = "";
    public string Content { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}
