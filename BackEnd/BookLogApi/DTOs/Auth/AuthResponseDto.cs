namespace BookLogApi.DTOs.Auth;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = "";
    public UserDto User { get; set; } = new();
}
