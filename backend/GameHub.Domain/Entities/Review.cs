using GameHub.Domain.Common;
using GameHub.Domain.Enums;

namespace GameHub.Domain.Entities;

public class Review : BaseEntity
{
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public int Reports { get; set; }
}
