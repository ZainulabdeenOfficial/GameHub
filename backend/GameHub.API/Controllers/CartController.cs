using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;
using GameHub.API.Extensions;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CartController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CartItemDto>>>> GetCart()
    {
        var userId = User.GetUserId();
        var items = await _unitOfWork.Repository<CartItem>().Query()
            .Where(c => c.UserId == userId)
            .Include(c => c.Game)
            .ToListAsync();

        var dtos = items.Select(c => new CartItemDto(
            c.Id, c.GameId, c.Game.Name, c.Game.Slug, c.Game.ThumbnailUrl,
            c.Quantity
        )).ToList();

        return Ok(ApiResponse<List<CartItemDto>>.Ok(dtos));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CartItemDto>>> AddToCart([FromBody] AddToCartRequest request)
    {
        var userId = User.GetUserId();
        var existing = await _unitOfWork.Repository<CartItem>()
            .GetFirstOrDefaultAsync(c => c.UserId == userId && c.GameId == request.GameId);

        if (existing != null)
        {
            existing.Quantity += request.Quantity;
            _unitOfWork.Repository<CartItem>().Update(existing);
        }
        else
        {
            existing = new CartItem
            {
                UserId = userId,
                GameId = request.GameId,
                Quantity = request.Quantity
            };
            await _unitOfWork.Repository<CartItem>().AddAsync(existing);
        }

        await _unitOfWork.SaveChangesAsync();

        var game = await _unitOfWork.Repository<Game>().GetByIdAsync(request.GameId);
        var dto = new CartItemDto(existing.Id, existing.GameId, game?.Name, game?.Slug, game?.ThumbnailUrl, existing.Quantity);
        return Ok(ApiResponse<CartItemDto>.Ok(dto, "Added to cart"));
    }

    [HttpDelete("{gameId}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveFromCart(string gameId)
    {
        var userId = User.GetUserId();
        var item = await _unitOfWork.Repository<CartItem>()
            .GetFirstOrDefaultAsync(c => c.UserId == userId && c.GameId == gameId);

        if (item == null) return NotFound(ApiResponse<bool>.NotFound("Item not in cart"));

        _unitOfWork.Repository<CartItem>().Delete(item);
        await _unitOfWork.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Ok(true, "Removed from cart"));
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<bool>>> ClearCart()
    {
        var userId = User.GetUserId();
        var items = await _unitOfWork.Repository<CartItem>().FindAsync(c => c.UserId == userId);

        foreach (var item in items)
            _unitOfWork.Repository<CartItem>().Delete(item);

        await _unitOfWork.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Cart cleared"));
    }
}

public record CartItemDto(string Id, string GameId, string? GameName, string? Slug, string? ThumbnailUrl, int Quantity);

public record AddToCartRequest(string GameId, int Quantity = 1);
