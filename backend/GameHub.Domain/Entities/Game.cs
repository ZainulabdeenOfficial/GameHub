using GameHub.Domain.Common;
using GameHub.Domain.Enums;

namespace GameHub.Domain.Entities;

public class Game : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? CategoryId { get; set; }
    public Category? Category { get; set; }
    public Platform Platform { get; set; }
    public string? PublisherId { get; set; }
    public Publisher? Publisher { get; set; }
    public string? DeveloperId { get; set; }
    public Developer? Developer { get; set; }
    public DateTime ReleaseDate { get; set; }
    public AgeRating AgeRating { get; set; }
    public string Languages { get; set; } = string.Empty;
    public string Genres { get; set; } = string.Empty;
    public double GameSize { get; set; }
    public string Version { get; set; } = "1.0";
    public string? MinimumRequirements { get; set; }
    public string? RecommendedRequirements { get; set; }
    public string? DownloadLink { get; set; }
    public string? SteamLink { get; set; }
    public string? EpicLink { get; set; }
    public string? TrailerUrl { get; set; }
    public GameStatus Status { get; set; } = GameStatus.Draft;
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; }
    public bool IsTrending { get; set; }
    public bool IsEditorsChoice { get; set; }
    public int TotalDownloads { get; set; }
    public int TotalViews { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? BannerUrl { get; set; }
    public ICollection<GameImage> Images { get; set; } = new List<GameImage>();
    public ICollection<Screenshot> Screenshots { get; set; } = new List<Screenshot>();
    public ICollection<GameFile> GameFiles { get; set; } = new List<GameFile>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
