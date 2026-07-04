using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Persistence.Context;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevelopersController : ControllerBase
{
    private readonly GameHubDbContext _context;

    public DevelopersController(GameHubDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Developer>>>> GetAll()
    {
        var developers = await _context.Developers.Where(d => d.IsActive).OrderBy(d => d.Name).ToListAsync();
        return Ok(ApiResponse<List<Developer>>.Ok(developers));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Developer>>> GetById(string id)
    {
        var developer = await _context.Developers.FindAsync(id);
        if (developer == null)
            return NotFound(ApiResponse<Developer>.NotFound("Developer not found"));
        return Ok(ApiResponse<Developer>.Ok(developer));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Developer>>> Create([FromBody] CreateDeveloperRequest request)
    {
        var slug = request.Name.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "");
        var existing = await _context.Developers.FirstOrDefaultAsync(d => d.Slug == slug);
        if (existing != null)
            return BadRequest(ApiResponse<Developer>.BadRequest("A developer with this name already exists"));

        var developer = new Developer
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Slug = slug,
            LogoUrl = request.LogoUrl,
            IsActive = true
        };

        _context.Developers.Add(developer);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Developer>.Ok(developer, "Developer created"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Developer>>> Update(string id, [FromBody] UpdateDeveloperRequest request)
    {
        var developer = await _context.Developers.FindAsync(id);
        if (developer == null)
            return NotFound(ApiResponse<Developer>.NotFound("Developer not found"));

        if (request.Name != null)
        {
            developer.Name = request.Name;
            developer.Slug = request.Name.ToLower().Replace(" ", "-").Replace("'", "").Replace(".", "");
        }
        if (request.LogoUrl != null) developer.LogoUrl = request.LogoUrl;
        if (request.IsActive.HasValue) developer.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<Developer>.Ok(developer, "Developer updated"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var developer = await _context.Developers.FindAsync(id);
        if (developer == null)
            return NotFound(ApiResponse<bool>.NotFound("Developer not found"));

        var gameCount = await _context.Games.CountAsync(g => g.DeveloperId == id && !g.IsDeleted);
        if (gameCount > 0)
            return BadRequest(ApiResponse<bool>.BadRequest($"Cannot delete developer with {gameCount} associated games"));

        developer.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Developer deactivated"));
    }
}

public record CreateDeveloperRequest(string Name, string? LogoUrl = null);
public record UpdateDeveloperRequest(string? Name, string? LogoUrl = null, bool? IsActive = null);
