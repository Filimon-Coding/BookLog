using BookLogApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

// ApplicationDbContext.cs
// This file is the main “database class” for the backend using Entity Framework Core.
// It tells EF which tables we have (like Books, Comments, MyBooks) and how they connect.
// Identity also plugs into this context, so users/roles get stored in the same database.
// When controllers query or save data, they normally do it through this DbContext.

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
