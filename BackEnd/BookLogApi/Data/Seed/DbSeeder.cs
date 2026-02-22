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

            // Books + Comments seed (adds missing books/comments even if DB already has data)

        var defaultCover = "/uploads/CoverNotFound.png"; // use one existing image if you don’t have covers for all

        var seedBooks = new List<Book>
        {
            new Book { Title = "Clean Code", AuthorName = "Robert C. Martin", Genre = "Programming", Description = "Writing cleaner and more maintainable code.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/Cleancode.jpeg" },
            new Book { Title = "The Pragmatic Programmer", AuthorName = "Andrew Hunt & David Thomas", Genre = "Programming", Description = "Practical tips for real software development.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/pragmatic-programmer-the.jpg" },
            new Book { Title = "1984", AuthorName = "George Orwell", Genre = "Fiction", Description = "A dystopian classic.", Status = BookVisibilityStatus.Published, CreatedByUserId = admin.Id, CoverImageUrl = "/uploads/1984.jpg" },
            new Book { Title = "The Hobbit", AuthorName = "J.R.R. Tolkien", Genre = "Fantasy", Description = "Adventure story in Middle-earth.", Status = BookVisibilityStatus.Published, CreatedByUserId = admin.Id, CoverImageUrl = "/uploads/Hobbit.jpeg"},
            new Book { Title = "Deep Work", AuthorName = "Cal Newport", Genre = "Productivity", Description = "Focus and avoiding distractions.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/DeepWork.jpg" },
            new Book { Title = "Atomic Habits", AuthorName = "James Clear", Genre = "Self-Improvement", Description = "Small habits that build big results.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/Atomic.jpg" },
            new Book { Title = "Sapiens", AuthorName = "Yuval Noah Harari", Genre = "History", Description = "A short history of humankind.", Status = BookVisibilityStatus.Published, CreatedByUserId = admin.Id, CoverImageUrl =  "/uploads/Sapiens.jpg"},
            new Book { Title = "Thinking, Fast and Slow", AuthorName = "Daniel Kahneman", Genre = "Psychology", Description = "How we think and make decisions.", Status = BookVisibilityStatus.Published, CreatedByUserId = admin.Id, CoverImageUrl = "/uploads/Thinking.jpg" },
            new Book { Title = "Dune", AuthorName = "Frank Herbert", Genre = "Sci-Fi", Description = "Politics, power, and survival on Arrakis.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/Dune.jpg"},
            new Book { Title = "The Alchemist", AuthorName = "Paulo Coelho", Genre = "Fiction", Description = "A simple story about purpose and goals.", Status = BookVisibilityStatus.Published, CreatedByUserId = author1.Id, CoverImageUrl = "/uploads/TheAlchemist.jpg"}
        };

        // Add missing books by Title
        foreach (var b in seedBooks)
        {
            var exists = await db.Books.AnyAsync(x => x.Title == b.Title);
            if (!exists)
            {
                if (string.IsNullOrWhiteSpace(b.CoverImageUrl)) b.CoverImageUrl = defaultCover;
                db.Books.Add(b);
            }
        }

        await db.SaveChangesAsync();

        // Helper to fetch the book ids after insert
        async Task<Book> GetBook(string title) => await db.Books.FirstAsync(b => b.Title == title);

        // Load all books (so we can attach comments)
        var cleanCode = await GetBook("Clean Code");
        var pragmatic = await GetBook("The Pragmatic Programmer");
        var n1984 = await GetBook("1984");
        var hobbit = await GetBook("The Hobbit");
        var deepWork = await GetBook("Deep Work");
        var atomic = await GetBook("Atomic Habits");
        var sapiens = await GetBook("Sapiens");
        var thinking = await GetBook("Thinking, Fast and Slow");
        var dune = await GetBook("Dune");
        var alchemist = await GetBook("The Alchemist");

        // Comments (2–4 per book, from admin/author1/reader1)
        var seedComments = new List<Comment>
        {
            // Clean Code (3)
            new Comment { BookId = cleanCode.Id, UserId = reader1.Id, Content = "This helped me understand what 'clean code' actually means." },
            new Comment { BookId = cleanCode.Id, UserId = author1.Id, Content = "Good examples, but you need to practice it for it to stick." },
            new Comment { BookId = cleanCode.Id, UserId = admin.Id, Content = "Solid book for anyone doing software projects." },

            // Pragmatic Programmer (3)
            new Comment { BookId = pragmatic.Id, UserId = reader1.Id, Content = "Easy to read and feels very practical." },
            new Comment { BookId = pragmatic.Id, UserId = author1.Id, Content = "Lots of small tips that actually matter in real code." },
            new Comment { BookId = pragmatic.Id, UserId = admin.Id, Content = "A classic book, still relevant." },

            // 1984 (2)
            new Comment { BookId = n1984.Id, UserId = reader1.Id, Content = "Kinda scary how relevant parts of it still are." },
            new Comment { BookId = n1984.Id, UserId = admin.Id, Content = "One of the most famous dystopian books for a reason." },

            // The Hobbit (3)
            new Comment { BookId = hobbit.Id, UserId = reader1.Id, Content = "Fun story and I like the adventure vibe." },
            new Comment { BookId = hobbit.Id, UserId = author1.Id, Content = "Good intro to Tolkien before LOTR." },
            new Comment { BookId = hobbit.Id, UserId = admin.Id, Content = "Classic fantasy, easy recommendation." },

            // Deep Work (3)
            new Comment { BookId = deepWork.Id, UserId = reader1.Id, Content = "Made me realize how distracted I am while studying." },
            new Comment { BookId = deepWork.Id, UserId = author1.Id, Content = "Helpful if you actually follow the rules and routines." },
            new Comment { BookId = deepWork.Id, UserId = admin.Id, Content = "Good book for productivity, especially for students." },

            // Atomic Habits (4)
            new Comment { BookId = atomic.Id, UserId = reader1.Id, Content = "Simple idea but it works when you track habits." },
            new Comment { BookId = atomic.Id, UserId = author1.Id, Content = "I like the examples, it keeps it easy to understand." },
            new Comment { BookId = atomic.Id, UserId = admin.Id, Content = "Good motivational book without being too cringe." },
            new Comment { BookId = atomic.Id, UserId = reader1.Id, Content = "The 1% better every day thing is a nice mindset." },

            // Sapiens (2)
            new Comment { BookId = sapiens.Id, UserId = reader1.Id, Content = "Interesting overview, but some parts felt heavy." },
            new Comment { BookId = sapiens.Id, UserId = admin.Id, Content = "Big ideas and good discussion starter." },

            // Thinking, Fast and Slow (3)
            new Comment { BookId = thinking.Id, UserId = reader1.Id, Content = "Hard at times, but I learned a lot about bias." },
            new Comment { BookId = thinking.Id, UserId = author1.Id, Content = "Makes you think twice before trusting your first answer." },
            new Comment { BookId = thinking.Id, UserId = admin.Id, Content = "Good book, but not the easiest read." },

            // Dune (3)
            new Comment { BookId = dune.Id, UserId = reader1.Id, Content = "The world-building is crazy good." },
            new Comment { BookId = dune.Id, UserId = author1.Id, Content = "A bit slow start, but it becomes really interesting." },
            new Comment { BookId = dune.Id, UserId = admin.Id, Content = "Sci-fi classic, deserves the hype." },

            // The Alchemist (2)
            new Comment { BookId = alchemist.Id, UserId = reader1.Id, Content = "Short and simple, good message." },
            new Comment { BookId = alchemist.Id, UserId = author1.Id, Content = "Not for everyone, but it’s a nice easy read." }
        };

        // Add missing comments (avoid duplicates)
        foreach (var c in seedComments)
        {
            var exists = await db.Comments.AnyAsync(x =>
                x.BookId == c.BookId &&
                x.UserId == c.UserId &&
                x.Content == c.Content);

            if (!exists)
                db.Comments.Add(c);
        }

        await db.SaveChangesAsync();
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
