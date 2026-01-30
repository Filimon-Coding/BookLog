namespace BookLogApi.DTOs.Auth;

public class RegisterRequestDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role { get; set; } = "Reader"; // Reader or Author
}
