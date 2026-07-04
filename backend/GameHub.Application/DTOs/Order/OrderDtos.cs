using GameHub.Domain.Enums;

namespace GameHub.Application.DTOs.Order;

public record OrderDto(
    string Id, string OrderNumber, string UserId, string? UserName, OrderStatus Status,
    PaymentMethod PaymentMethod, PaymentStatus PaymentStatus, string? TransactionId,
    string? CouponCode, DateTime CreatedAt, List<OrderItemDto> Items
);

public record OrderItemDto(string Id, string GameId, string? GameName, string? ThumbnailUrl, int Quantity);

public record CreateOrderRequest(
    PaymentMethod PaymentMethod, string? CouponCode, string? Notes,
    string? ShippingAddress, string? BillingAddress
);

public record UpdateOrderStatusRequest(string OrderId, OrderStatus Status);
