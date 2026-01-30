using BookLogApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Data;

public class ApplicationDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<MyBook> MyBooks => Set<MyBook>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<MyBook>()
            .HasIndex(x => new { x.UserId, x.BookId })
            .IsUnique();

        builder.Entity<Book>()
            .HasMany(b => b.Comments)
            .WithOne(c => c.Book!)
            .HasForeignKey(c => c.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
