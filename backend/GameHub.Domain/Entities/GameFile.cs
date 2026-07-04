using GameHub.Domain.Common;
using GameHub.Domain.Enums;

namespace GameHub.Domain.Entities;

public class GameFile : BaseEntity
{
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string? Url { get; set; }
    public long FileSize { get; set; }
    public string? ContentType { get; set; }
    public FileType Type { get; set; }
    public string? Version { get; set; }
    public string? MirrorLinks { get; set; }
    public int DownloadCount { get; set; }
}
