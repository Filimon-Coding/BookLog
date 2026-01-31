using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    [HttpPost("cover")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> UploadCover([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Allow only images (simple check)
        var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest("Only jpg, png, webp allowed.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp")
            return BadRequest("Invalid file extension.");

        var fileName = $"{Guid.NewGuid():N}{ext}";

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var fullPath = Path.Combine(uploadsPath, fileName);

        using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        // This is the "local link" you can store on the Book
        var url = $"/uploads/{fileName}";
        return Ok(new { url });
    }
}
