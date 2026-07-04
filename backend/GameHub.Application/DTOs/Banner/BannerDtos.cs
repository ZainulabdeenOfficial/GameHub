namespace GameHub.Application.DTOs.Banner;

public record BannerDto(
    string Id, string Title, string? Subtitle, string? ImageUrl,
    string? YoutubeUrl,
    string? GameId, string? GameName, string? GameSlug,
    string? LinkUrl, string? ButtonText, string? BackgroundColor,
    int SortOrder, bool IsActive, DateTime CreatedAt
);

public record CreateBannerRequest(
    string Title, string? Subtitle, string? ImageUrl,
    string? YoutubeUrl,
    string? GameId, string? LinkUrl, string? ButtonText,
    string? BackgroundColor, int SortOrder, bool IsActive
);

public record UpdateBannerRequest(
    string Title, string? Subtitle, string? ImageUrl,
    string? YoutubeUrl,
    string? GameId, string? LinkUrl, string? ButtonText,
    string? BackgroundColor, int SortOrder, bool IsActive
);
