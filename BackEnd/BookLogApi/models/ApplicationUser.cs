using Microsoft.AspNetCore.Identity;

namespace BookLogApi.Models;

public class ApplicationUser : IdentityUser<int>
{
    // You can extend later (DisplayName etc.)
}
