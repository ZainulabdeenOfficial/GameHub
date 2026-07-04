using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class CartItem : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public int Quantity { get; set; } = 1;
}
