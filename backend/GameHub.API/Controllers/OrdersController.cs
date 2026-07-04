using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.Order;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public OrdersController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<OrderDto>>>> GetMyOrders()
    {
        var orders = await _unitOfWork.Repository<Order>().GetAllAsync();
        var orderDtos = orders.Select(MapToDto).ToList();
        return Ok(ApiResponse<List<OrderDto>>.Ok(orderDtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetById(string id)
    {
        var order = await _unitOfWork.Repository<Order>().GetByIdAsync(id);
        if (order == null) return NotFound(ApiResponse<OrderDto>.NotFound());
        return Ok(ApiResponse<OrderDto>.Ok(MapToDto(order)));
    }

    private static OrderDto MapToDto(Order o)
    {
        return new OrderDto(
            o.Id, o.OrderNumber, o.UserId, null, o.Status,
            o.PaymentMethod, o.PaymentStatus, o.TransactionId, o.CouponCode, o.CreatedAt,
            o.OrderItems.Select(i => new OrderItemDto(i.Id, i.GameId, null, null, i.Quantity)).ToList()
        );
    }
}
