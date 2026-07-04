using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class Download : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public string? GameFileId { get; set; }
    public GameFile? GameFile { get; set; }
    public string? IpAddress { get; set; }
    public long DownloadedBytes { get; set; }
    public DateTime? CompletedAt { get; set; }
}
