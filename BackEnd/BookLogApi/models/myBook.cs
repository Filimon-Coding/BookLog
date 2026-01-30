using BookLogApi.Models.Enums;

namespace BookLogApi.Models;

public class MyBook
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public int BookId { get; set; }
    public Book? Book { get; set; }

    public MyBookStatus Status { get; set; } = MyBookStatus.WantToRead;
}
