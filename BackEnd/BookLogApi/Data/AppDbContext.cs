using BookLogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Existing Book config
        modelBuilder.Entity<Book>(b =>
        {
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Author).IsRequired().HasMaxLength(200);
            b.Property(x => x.Genre).HasMaxLength(80);
        });

        // Add Comment config HERE (inside the same method)
        modelBuilder.Entity<Comment>(c =>
        {
            c.Property(x => x.UserName).IsRequired().HasMaxLength(80);
            c.Property(x => x.Text).IsRequired().HasMaxLength(1000);

            c.HasOne(x => x.Book)
             .WithMany(b => b.Comments)
             .HasForeignKey(x => x.BookId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
