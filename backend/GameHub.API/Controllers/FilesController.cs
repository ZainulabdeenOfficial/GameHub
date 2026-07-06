using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using GameHub.Application.DTOs.Common;

namespace GameHub.API.Controllers;

[ApiController]
public class FilesController : ControllerBase
{
    private readonly string _webRootPath;

    public FilesController(IWebHostEnvironment env)
    {
        _webRootPath = env.WebRootPath;
    }

    [AllowAnonymous]
    [HttpGet("uploads/{**filePath}")]
    public IActionResult GetUploadedFile(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return NotFound();

        filePath = filePath.TrimStart('/');
        var fullPath = Path.Combine(_webRootPath, "uploads", filePath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound();

        var ext = Path.GetExtension(fullPath).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            ".ico" => "image/x-icon",
            ".pdf" => "application/pdf",
            ".mp4" => "video/mp4",
            ".zip" => "application/zip",
            _ => "application/octet-stream"
        };

        return PhysicalFile(fullPath, contentType);
    }
}
