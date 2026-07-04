using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.Review;
using GameHub.Domain.Entities;
using GameHub.Domain.Enums;
using GameHub.Persistence.Context;
using System.Security.Claims;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly GameHubDbContext _context;

    public ReviewsController(GameHubDbContext context)
    {
        _context = context;
    }

    [HttpGet("game/{gameId}")]
    public async Task<ActionResult<ApiResponse<List<ReviewListDto>>>> GetGameReviews(string gameId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.GameId == gameId && r.Status == ReviewStatus.Approved)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewListDto(
                r.Id, r.UserId, r.User.FullName, r.User.ProfilePictureUrl,
                r.Rating, r.Comment, r.CreatedAt, r.Likes
            ))
            .ToListAsync();

        return Ok(ApiResponse<List<ReviewListDto>>.Ok(reviews));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> Create([FromBody] CreateReviewRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse<ReviewDto>.Unauthorized("User not found"));

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest(ApiResponse<ReviewDto>.BadRequest("Rating must be between 1 and 5"));

        if (string.IsNullOrWhiteSpace(request.Comment))
            return BadRequest(ApiResponse<ReviewDto>.BadRequest("Comment is required"));

        var gameExists = await _context.Games.AnyAsync(g => g.Id == request.GameId && !g.IsDeleted);
        if (!gameExists)
            return NotFound(ApiResponse<ReviewDto>.NotFound("Game not found"));

        var existing = await _context.Reviews
            .FirstOrDefaultAsync(r => r.GameId == request.GameId && r.UserId == userId);
        if (existing != null)
            return BadRequest(ApiResponse<ReviewDto>.BadRequest("You have already reviewed this game"));

        var review = new Review
        {
            GameId = request.GameId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment,
            Status = ReviewStatus.Approved
        };

        _context.Reviews.Add(review);

        var allReviews = await _context.Reviews
            .Where(r => r.GameId == request.GameId && r.Status == ReviewStatus.Approved)
            .ToListAsync();

        var game = await _context.Games.FindAsync(request.GameId);
        if (game != null)
        {
            game.TotalReviews = allReviews.Count + 1;
            game.AverageRating = (allReviews.Sum(r => r.Rating) + request.Rating) / (double)(allReviews.Count + 1);
        }

        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);
        var dto = new ReviewDto(
            review.Id, review.GameId, review.UserId, user?.FullName ?? "Unknown",
            user?.ProfilePictureUrl, review.Rating, review.Comment, review.CreatedAt, review.Likes
        );

        return CreatedAtAction(nameof(GetGameReviews), new { gameId = request.GameId },
            ApiResponse<ReviewDto>.Created(dto, "Review submitted"));
    }
}
