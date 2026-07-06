using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using GameHub.Domain.Interfaces;

namespace GameHub.Infrastructure.Services;

public class FileUploadService : IFileUploadService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileUploadService> _logger;

    public FileUploadService(IConfiguration configuration, ILogger<FileUploadService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> UploadAsync(IFormFile file, string folder = "general")
    {
        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        _logger.LogInformation("File uploaded: {FileName}", fileName);
        return $"/uploads/{folder}/{fileName}";
    }

    public async Task<string> UploadFromUrlAsync(string url, string folder = "general")
    {
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(url);
        if (string.IsNullOrEmpty(ext))
        {
            var contentType = response.Content.Headers.ContentType?.MediaType;
            ext = contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/gif" => ".gif",
                _ => ".jpg"
            };
        }

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = await response.Content.ReadAsStreamAsync();
        await using var fileStream = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(fileStream);

        return $"/uploads/{folder}/{fileName}";
    }

    public Task<bool> DeleteAsync(string publicId)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", publicId.TrimStart('/'));
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<string> GetOptimizedUrl(string publicId, int width = 0, int height = 0)
    {
        return Task.FromResult(publicId);
    }
}
