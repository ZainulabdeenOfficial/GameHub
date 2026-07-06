using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Interfaces;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,Admin")]
public class UploadController : ControllerBase
{
    private readonly IFileUploadService _fileUploadService;

    public UploadController(IFileUploadService fileUploadService)
    {
        _fileUploadService = fileUploadService;
    }

    [HttpPost("image")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<string>>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<string>.BadRequest("No file provided"));

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(ApiResponse<string>.BadRequest("Only JPEG, PNG, WebP, and GIF images are allowed"));

        var url = await _fileUploadService.UploadAsync(file, "games/images");
        return Ok(ApiResponse<string>.Ok(url, "Image uploaded"));
    }

    [HttpPost("image-url")]
    public async Task<ActionResult<ApiResponse<string>>> UploadImageFromUrl([FromBody] UploadUrlRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
            return BadRequest(ApiResponse<string>.BadRequest("URL is required"));

        try
        {
            var url = await _fileUploadService.UploadFromUrlAsync(request.Url, "games/images");
            return Ok(ApiResponse<string>.Ok(url, "Image uploaded from URL"));
        }
        catch
        {
            return BadRequest(ApiResponse<string>.BadRequest("Failed to download image from URL"));
        }
    }

    [HttpPost("file")]
    [RequestSizeLimit(200 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<string>>> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<string>.BadRequest("No file provided"));

        var url = await _fileUploadService.UploadAsync(file, "games/files");
        return Ok(ApiResponse<string>.Ok(url, "File uploaded"));
    }
}

public record UploadUrlRequest(string Url);
