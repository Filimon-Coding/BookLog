namespace BookLogApi.DTOs.Books;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string AuthorName { get; set; } = "";
    public string? Genre { get; set; }
    public string? Description { get; set; }

    public string? CoverImageUrl { get; set; }

    public string Status { get; set; } = "Published";
    public int CreatedByUserId { get; set; }
}
