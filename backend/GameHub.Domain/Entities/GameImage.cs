using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class GameImage : BaseEntity
{
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsThumbnail { get; set; }
    public long FileSize { get; set; }
    public string? ContentType { get; set; }
}
