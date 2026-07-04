using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class Banner : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public string? GameId { get; set; }
    public Game? Game { get; set; }
    public string? LinkUrl { get; set; }
    public string? ButtonText { get; set; }
    public string? BackgroundColor { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
