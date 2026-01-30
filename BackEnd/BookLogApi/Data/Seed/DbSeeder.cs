using BookLogApi.Models;
using Microsoft.AspNetCore.Identity;

namespace BookLogApi.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = ["Admin", "Reader", "Author"];

        foreach (var r in roles)
        {
            if (!await roleManager.RoleExistsAsync(r))
            {
                await roleManager.CreateAsync(new IdentityRole<int>(r));
            }
        }

        // Seed ONE admin if none exists (change password later!)
        var existingAdmin = await userManager.FindByNameAsync("admin");
        if (existingAdmin == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@booklog.local"
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
