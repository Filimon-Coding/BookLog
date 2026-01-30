namespace BookLogApi.DTOs.Books;

public class CreateBookDto
{
    public string Title { get; set; } = "";
    public string AuthorName { get; set; } = "";
    public string? Genre { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = "Published";
}
