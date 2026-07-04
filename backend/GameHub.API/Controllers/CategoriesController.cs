using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Category>>>> GetAll()
    {
        var categories = await _unitOfWork.Repository<Category>().Query()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(ApiResponse<List<Category>>.Ok(categories));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Category>>> GetById(string id)
    {
        var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
        return category == null ? NotFound(ApiResponse<Category>.NotFound()) : Ok(ApiResponse<Category>.Ok(category));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Category>>> Create([FromBody] Category category)
    {
        try
        {
            var baseSlug = category.Name.ToLower().Replace(" ", "-").Replace("--", "-").Trim('-');
            var slug = baseSlug;
            var counter = 1;
            while (await _unitOfWork.Repository<Category>().ExistsAsync(c => c.Slug == slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }
            category.Slug = slug;
            if (string.IsNullOrEmpty(category.ImageUrl)) category.ImageUrl = null;
            if (string.IsNullOrEmpty(category.Icon)) category.Icon = null;
            await _unitOfWork.Repository<Category>().AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, ApiResponse<Category>.Created(category));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<Category>.BadRequest($"Failed to save category: {ex.Message}"));
        }
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Category>>> Update(string id, [FromBody] Category category)
    {
        try
        {
            var existing = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (existing == null) return NotFound(ApiResponse<Category>.NotFound());
            existing.Name = category.Name;
            var baseSlug = category.Name.ToLower().Replace(" ", "-").Replace("--", "-").Trim('-');
            var slug = baseSlug;
            var counter = 1;
            while (await _unitOfWork.Repository<Category>().ExistsAsync(c => c.Slug == slug && c.Id != id))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }
            existing.Slug = slug;
            existing.Description = category.Description;
            existing.Icon = string.IsNullOrEmpty(category.Icon) ? null : category.Icon;
            existing.ImageUrl = string.IsNullOrEmpty(category.ImageUrl) ? null : category.ImageUrl;
            existing.IsActive = category.IsActive;
            existing.DisplayOrder = category.DisplayOrder;
            _unitOfWork.Repository<Category>().Update(existing);
            await _unitOfWork.SaveChangesAsync();
            return Ok(ApiResponse<Category>.Ok(existing));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<Category>.BadRequest($"Failed to update category: {ex.Message}"));
        }
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category == null) return NotFound(ApiResponse<bool>.NotFound());

        var games = await _unitOfWork.Repository<Game>().Query()
            .Where(g => g.CategoryId == id && !g.IsDeleted)
            .ToListAsync();
        foreach (var game in games)
        {
            game.CategoryId = null;
            _unitOfWork.Repository<Game>().Update(game);
        }

        var subCategories = await _unitOfWork.Repository<Category>().Query()
            .Where(c => c.ParentCategoryId == id && !c.IsDeleted)
            .ToListAsync();
        foreach (var sub in subCategories)
        {
            sub.ParentCategoryId = null;
            _unitOfWork.Repository<Category>().Update(sub);
        }

        category.IsDeleted = true;
        category.DeletedAt = DateTime.UtcNow;
        _unitOfWork.Repository<Category>().Update(category);
        await _unitOfWork.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Category deleted"));
    }
}
