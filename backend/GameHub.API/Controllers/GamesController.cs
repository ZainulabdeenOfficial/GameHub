using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.Game;
using GameHub.Application.Interfaces;
using GameHub.Domain.Entities;
using GameHub.Persistence.Context;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly GameHubDbContext _context;

    public GamesController(IGameService gameService, GameHubDbContext context)
    {
        _gameService = gameService;
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<GameStatsDto>>> GetStats()
    {
        var totalGames = await _context.Games.CountAsync(g => !g.IsDeleted && g.Status == Domain.Enums.GameStatus.Published);
        var totalDownloads = await _context.Downloads.CountAsync();
        var totalReviews = await _context.Reviews.CountAsync();
        var totalUsers = await _context.Users.CountAsync();

        var stats = new GameStatsDto(totalGames, totalDownloads, totalReviews, totalUsers);
        return Ok(ApiResponse<GameStatsDto>.Ok(stats));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<List<GameListDto>>>>> GetAll([FromQuery] GameFilterRequest filter)
    {
        var result = await _gameService.GetAllAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<GameDto>>> GetById(string id)
    {
        var result = await _gameService.GetByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<GameListDto>>>> GetFeatured()
    {
        var result = await _gameService.GetFeaturedAsync();
        return Ok(result);
    }

    [HttpGet("trending")]
    public async Task<ActionResult<ApiResponse<List<GameListDto>>>> GetTrending()
    {
        var result = await _gameService.GetTrendingAsync();
        return Ok(result);
    }

    [HttpGet("latest")]
    public async Task<ActionResult<ApiResponse<List<GameListDto>>>> GetLatest([FromQuery] int count = 10)
    {
        var result = await _gameService.GetLatestAsync(count);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<List<GameListDto>>>> Search([FromQuery] string term)
    {
        var result = await _gameService.SearchAsync(term);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<GameDto>>> Create([FromBody] CreateGameRequest request)
    {
        var result = await _gameService.CreateAsync(request);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result) : BadRequest(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<GameDto>>> Update(string id, [FromBody] UpdateGameRequest request)
    {
        var result = await _gameService.UpdateAsync(id, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var result = await _gameService.DeleteAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost("bulk-delete")]
    public async Task<ActionResult<ApiResponse<bool>>> BulkDelete([FromBody] List<string> ids)
    {
        var result = await _gameService.BulkDeleteAsync(ids);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<ApiResponse<GameDto>>> Duplicate(string id)
    {
        var result = await _gameService.DuplicateAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<bool>>> ChangeStatus(string id, [FromBody] string status)
    {
        var result = await _gameService.ChangeStatusAsync(id, status);
        return Ok(result);
    }

    // ========== SCREENSHOTS ==========
    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet("{gameId}/screenshots")]
    public async Task<ActionResult<ApiResponse<List<Screenshot>>>> GetScreenshots(string gameId)
    {
        var screenshots = await _context.Screenshots
            .Where(s => s.GameId == gameId)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();
        return Ok(ApiResponse<List<Screenshot>>.Ok(screenshots));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost("{gameId}/screenshots")]
    public async Task<ActionResult<ApiResponse<Screenshot>>> AddScreenshot(string gameId, [FromBody] AddScreenshotRequest request)
    {
        var game = await _context.Games.FindAsync(gameId);
        if (game == null)
            return NotFound(ApiResponse<Screenshot>.NotFound("Game not found"));

        var maxOrder = await _context.Screenshots
            .Where(s => s.GameId == gameId)
            .MaxAsync(s => (int?)s.DisplayOrder) ?? -1;

        var screenshot = new Screenshot
        {
            Id = Guid.NewGuid().ToString(),
            GameId = gameId,
            Url = request.Url,
            PublicId = request.PublicId,
            Caption = request.Caption,
            DisplayOrder = maxOrder + 1,
            FileSize = request.FileSize,
            ContentType = request.ContentType
        };

        _context.Screenshots.Add(screenshot);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Screenshot>.Ok(screenshot, "Screenshot added"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{gameId}/screenshots/{screenshotId}")]
    public async Task<ActionResult<ApiResponse<Screenshot>>> UpdateScreenshot(string gameId, string screenshotId, [FromBody] UpdateScreenshotRequest request)
    {
        var screenshot = await _context.Screenshots
            .FirstOrDefaultAsync(s => s.Id == screenshotId && s.GameId == gameId);
        if (screenshot == null)
            return NotFound(ApiResponse<Screenshot>.NotFound("Screenshot not found"));

        if (request.Caption != null) screenshot.Caption = request.Caption;
        if (request.DisplayOrder.HasValue) screenshot.DisplayOrder = request.DisplayOrder.Value;

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Screenshot>.Ok(screenshot, "Screenshot updated"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{gameId}/screenshots/{screenshotId}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteScreenshot(string gameId, string screenshotId)
    {
        var screenshot = await _context.Screenshots
            .FirstOrDefaultAsync(s => s.Id == screenshotId && s.GameId == gameId);
        if (screenshot == null)
            return NotFound(ApiResponse<bool>.NotFound("Screenshot not found"));

        _context.Screenshots.Remove(screenshot);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Screenshot deleted"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{gameId}/screenshots/reorder")]
    public async Task<ActionResult<ApiResponse<bool>>> ReorderScreenshots(string gameId, [FromBody] List<ReorderScreenshotRequest> items)
    {
        var screenshotIds = items.Select(i => i.Id).ToList();
        var screenshots = await _context.Screenshots
            .Where(s => s.GameId == gameId && screenshotIds.Contains(s.Id))
            .ToListAsync();

        foreach (var item in items)
        {
            var screenshot = screenshots.FirstOrDefault(s => s.Id == item.Id);
            if (screenshot != null)
                screenshot.DisplayOrder = item.DisplayOrder;
        }

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Screenshots reordered"));
    }

    [HttpPost("{id}/download")]
    public async Task<ActionResult<ApiResponse<string>>> Download(string id)
    {
        var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);
        if (game == null) return NotFound(ApiResponse<string>.NotFound("Game not found"));

        game.TotalDownloads++;
        _context.Games.Update(game);
        await _context.SaveChangesAsync();

        var downloadUrl = game.DownloadLink ?? game.ThumbnailUrl ?? $"/api/games/{id}/file";
        return Ok(ApiResponse<string>.Ok(downloadUrl, "Download started"));
    }
}
