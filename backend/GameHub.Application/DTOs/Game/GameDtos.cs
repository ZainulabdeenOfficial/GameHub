using GameHub.Domain.Enums;

namespace GameHub.Application.DTOs.Game;

public record GameDto(
    string Id, string Name, string Slug, string Description, string ShortDescription,
    string? CategoryId, string? CategoryName,
    Platform Platform, string? PublisherId, string? PublisherName,
    string? DeveloperId, string? DeveloperName, DateTime ReleaseDate,
    AgeRating AgeRating, string Languages, string Genres, double GameSize,
    string Version, string? MinimumRequirements, string? RecommendedRequirements,
    string? DownloadLink, string? SteamLink, string? EpicLink, string? TrailerUrl,
    GameStatus Status, bool IsFeatured, bool IsPopular, bool IsTrending,
    bool IsEditorsChoice, int TotalDownloads, int TotalViews,
    double AverageRating, int TotalReviews, string? ThumbnailUrl, string? BannerUrl,
    DateTime CreatedAt, List<GameImageDto> Images, List<ScreenshotDto> Screenshots
);

public record CreateGameRequest(
    string Name, string Description, string ShortDescription,
    string CategoryId, Platform Platform, string? PublisherId,
    string? DeveloperId, DateTime ReleaseDate, AgeRating AgeRating, string Languages,
    string Genres, double GameSize, string Version, string? MinimumRequirements,
    string? RecommendedRequirements, string? DownloadLink, string? SteamLink,
    string? EpicLink, string? TrailerUrl, GameStatus Status, bool IsFeatured,
    bool IsPopular, bool IsTrending, bool IsEditorsChoice,
    string? ThumbnailUrl = null, string? BannerUrl = null,
    List<AddScreenshotRequest>? Screenshots = null
);

public record UpdateGameRequest(
    string? Name, string? Description, string? ShortDescription,
    string? CategoryId, Platform? Platform, string? PublisherId,
    string? DeveloperId, DateTime? ReleaseDate, AgeRating? AgeRating, string? Languages,
    string? Genres, double? GameSize, string? Version, string? MinimumRequirements,
    string? RecommendedRequirements, string? DownloadLink, string? SteamLink,
    string? EpicLink, string? TrailerUrl, GameStatus? Status, bool? IsFeatured,
    bool? IsPopular, bool? IsTrending, bool? IsEditorsChoice,
    string? ThumbnailUrl = null, string? BannerUrl = null
);

public record GameImageDto(string Id, string Url, string? PublicId, string? AltText, int DisplayOrder, bool IsThumbnail);
public record ScreenshotDto(string Id, string Url, string? PublicId, string? Caption, int DisplayOrder);
public record AddScreenshotRequest(string Url, string? PublicId, string? Caption, long FileSize = 0, string? ContentType = null);
public record UpdateScreenshotRequest(string? Caption, int? DisplayOrder);
public record ReorderScreenshotRequest(string Id, int DisplayOrder);
public record GameListDto(string Id, string Name, string Slug, string? ThumbnailUrl, double AverageRating, GameStatus Status, bool IsFeatured, bool IsTrending, int TotalDownloads);

public record GameStatsDto(int TotalGames, int TotalDownloads, int TotalReviews, int TotalUsers);

public record GameFilterRequest(
    string? Search, string? CategoryId, Platform? Platform, string? PublisherId,
    string? Genre, int? MinRating,
    int? ReleaseYear, string? SortBy, bool? IsDescending,
    int PageNumber = 1, int PageSize = 10
);
