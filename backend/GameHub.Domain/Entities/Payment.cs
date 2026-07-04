using GameHub.Domain.Common;
using GameHub.Domain.Enums;

namespace GameHub.Domain.Entities;

public class Payment : BaseEntity
{
    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; } = null!;
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? ResponseData { get; set; }
    public DateTime? PaidAt { get; set; }
}
