using BookLogApi.DTOs.Books;

namespace BookLogApi.DTOs.MyBooks;

public class MyBookDto
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Status { get; set; } = "WantToRead";
    public BookDto Book { get; set; } = new();
}
