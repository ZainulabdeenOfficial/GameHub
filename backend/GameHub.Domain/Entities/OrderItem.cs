using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class OrderItem : BaseEntity
{
    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; } = null!;
    public string GameId { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal TotalPrice => Price * Quantity;
}
