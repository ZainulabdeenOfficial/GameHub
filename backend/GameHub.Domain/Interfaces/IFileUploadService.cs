using Microsoft.AspNetCore.Http;

namespace GameHub.Domain.Interfaces;

public interface IFileUploadService
{
    Task<string> UploadAsync(IFormFile file, string folder = "general");
    Task<string> UploadFromUrlAsync(string url, string folder = "general");
    Task<bool> DeleteAsync(string publicId);
    Task<string> GetOptimizedUrl(string publicId, int width = 0, int height = 0);
}
