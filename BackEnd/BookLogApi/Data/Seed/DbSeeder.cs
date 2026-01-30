using BookLogApi.Models;
using BookLogApi.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookLogApi.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // 1) Roles
        string[] roles = ["Admin", "Reader", "Author"];
        foreach (var r in roles)
        {
            if (!await roleManager.RoleExistsAsync(r))
                await roleManager.CreateAsync(new IdentityRole<int>(r));
        }

        // 2) Users (real Identity users with hashed passwords)
        var admin = await EnsureUserAsync(userManager, "admin", "admin@booklog.local", "Admin123!", "Admin");
        var author1 = await EnsureUserAsync(userManager, "author1", "author1@booklog.local", "Test123!", "Author");
        var reader1 = await EnsureUserAsync(userManager, "reader1", "reader1@booklog.local", "Test123!", "Reader");

        // 3) Books (only add if empty)
        if (!await db.Books.AnyAsync())
        {
            var b1 = new Book
            {
                Title = "Clean Code",
                AuthorName = "Robert C. Martin",
                Genre = "Programming",
                Description = "A handbook of agile software craftsmanship.",
                Status = BookVisibilityStatus.Published,
                CreatedByUserId = author1.Id
            };

            var b2 = new Book
            {
                Title = "The Pragmatic Programmer",
                AuthorName = "Andrew Hunt & David Thomas",
                Genre = "Programming",
                Description = "Classic book about pragmatic software development.",
                Status = BookVisibilityStatus.Published,
                CreatedByUserId = author1.Id
            };

            var b3 = new Book
            {
                Title = "1984",
                AuthorName = "George Orwell",
                Genre = "Fiction",
                Description = "Dystopian novel.",
                Status = BookVisibilityStatus.Published,
                CreatedByUserId = admin.Id   // admin created this one
            };

            db.Books.AddRange(b1, b2, b3);
            await db.SaveChangesAsync();

            // 4) Comments
            db.Comments.AddRange(
                new Comment
                {
                    BookId = b1.Id,
                    UserId = reader1.Id,
                    Content = "Really useful concepts, especially naming + small functions."
                },
                new Comment
                {
                    BookId = b1.Id,
                    UserId = author1.Id,
                    Content = "Agree. Some parts are opinionated, but still valuable."
                },
                new Comment
                {
                    BookId = b3.Id,
                    UserId = reader1.Id,
                    Content = "Scary how relevant this still feels."
                }
            );

            // 5) MyBooks (Reader list)
            db.MyBooks.AddRange(
                new MyBook { UserId = reader1.Id, BookId = b1.Id, Status = MyBookStatus.Reading },
                new MyBook { UserId = reader1.Id, BookId = b2.Id, Status = MyBookStatus.WantToRead },
                new MyBook { UserId = reader1.Id, BookId = b3.Id, Status = MyBookStatus.Finished }
            );

            await db.SaveChangesAsync();
        }
    }

    private static async Task<ApplicationUser> EnsureUserAsync(
        UserManager<ApplicationUser> userManager,
        string username,
        string email,
        string password,
        string role)
    {
        var user = await userManager.FindByNameAsync(username);
        if (user != null)
        {
            // ensure role exists on user
            if (!await userManager.IsInRoleAsync(user, role))
                await userManager.AddToRoleAsync(user, role);

            return user;
        }

        user = new ApplicationUser
        {
            UserName = username,
            Email = email
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            throw new Exception("Seed user failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));

        await userManager.AddToRoleAsync(user, role);
        return user;
    }
}
