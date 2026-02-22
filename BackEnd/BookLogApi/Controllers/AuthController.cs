using BookLogApi.DTOs.Auth;
using BookLogApi.Models;
using BookLogApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookLogApi.Controllers;

// AuthController.cs
// This controller handles login and register requests from the frontend.
// It uses Identity to create users and check passwords during login.
// When login is successful, it generates a JWT token and sends it back to the client.
// The token is then used to access protected endpoints in the API.

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwt;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService jwt)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto dto)
    {
        var role = dto.Role?.Trim();

        // Keep it realistic: only Reader/Author can self-register
        if (role != "Reader" && role != "Author")
            return BadRequest("Role must be Reader or Author.");

        var user = new ApplicationUser { UserName = dto.Username };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        await _userManager.AddToRoleAsync(user, role);

        var token = await _jwt.CreateTokenAsync(user);

        return Ok(new AuthResponseDto
        {
            AccessToken = token,
            User = new UserDto { Id = user.Id, Username = user.UserName!, Role = role }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null) return Unauthorized("Invalid username/password.");

        var ok = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!ok.Succeeded) return Unauthorized("Invalid username/password.");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Reader";

        var token = await _jwt.CreateTokenAsync(user);

        return Ok(new AuthResponseDto
        {
            AccessToken = token,
            User = new UserDto { Id = user.Id, Username = user.UserName!, Role = role }
        });
    }
}
