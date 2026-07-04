using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Persistence.Context;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublishersController : ControllerBase
{
    private readonly GameHubDbContext _context;

    public PublishersController(GameHubDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Publisher>>>> GetAll()
    {
        var publishers = await _context.Publishers.Where(p => p.IsActive).OrderBy(p => p.Name).ToListAsync();
        return Ok(ApiResponse<List<Publisher>>.Ok(publishers));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Publisher>>> GetById(string id)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound(ApiResponse<Publisher>.NotFound("Publisher not found"));
        return Ok(ApiResponse<Publisher>.Ok(publisher));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Publisher>>> Create([FromBody] CreatePublisherRequest request)
    {
        var slug = request.Name.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "");
        var existing = await _context.Publishers.FirstOrDefaultAsync(p => p.Slug == slug);
        if (existing != null)
            return BadRequest(ApiResponse<Publisher>.BadRequest("A publisher with this name already exists"));

        var publisher = new Publisher
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Slug = slug,
            LogoUrl = request.LogoUrl,
            IsActive = true
        };

        _context.Publishers.Add(publisher);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Publisher>.Ok(publisher, "Publisher created"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Publisher>>> Update(string id, [FromBody] UpdatePublisherRequest request)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound(ApiResponse<Publisher>.NotFound("Publisher not found"));

        if (request.Name != null)
        {
            publisher.Name = request.Name;
            publisher.Slug = request.Name.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "");
        }
        if (request.LogoUrl != null) publisher.LogoUrl = request.LogoUrl;
        if (request.IsActive.HasValue) publisher.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Publisher>.Ok(publisher, "Publisher updated"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound(ApiResponse<bool>.NotFound("Publisher not found"));

        var gameCount = await _context.Games.CountAsync(g => g.PublisherId == id && !g.IsDeleted);
        if (gameCount > 0)
            return BadRequest(ApiResponse<bool>.BadRequest($"Cannot delete publisher with {gameCount} associated games"));

        publisher.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Publisher deactivated"));
    }
}

public record CreatePublisherRequest(string Name, string? LogoUrl = null);
public record UpdatePublisherRequest(string? Name, string? LogoUrl = null, bool? IsActive = null);
