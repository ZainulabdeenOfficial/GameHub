using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.HeroBanner;
using GameHub.Application.Interfaces;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/hero-banners")]
public class HeroBannersController : ControllerBase
{
    private readonly IHeroBannerService _bannerService;

    public HeroBannersController(IHeroBannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet("published")]
    public async Task<ActionResult<ApiResponse<List<HeroBannerDto>>>> GetPublished()
    {
        var result = await _bannerService.GetPublishedAsync();
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<HeroBannerDto>>>> GetFeatured()
    {
        var result = await _bannerService.GetFeaturedAsync();
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<HeroBannerDto>>>> GetAll()
    {
        var result = await _bannerService.GetAllAsync();
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<HeroBannerDto>>> GetById(string id)
    {
        var result = await _bannerService.GetByIdAsync(id);
        return result.StatusCode == 404 ? NotFound(result) : Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<HeroBannerDto>>> Create([FromBody] CreateHeroBannerRequest request)
    {
        var result = await _bannerService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<HeroBannerDto>>> Update(string id, [FromBody] UpdateHeroBannerRequest request)
    {
        var result = await _bannerService.UpdateAsync(id, request);
        return result.StatusCode == 404 ? NotFound(result) : Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var result = await _bannerService.DeleteAsync(id);
        return result.StatusCode == 404 ? NotFound(result) : Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<ApiResponse<HeroBannerDto>>> Duplicate(string id)
    {
        var result = await _bannerService.DuplicateAsync(id);
        return result.StatusCode == 404 ? NotFound(result) : Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<bool>>> Reorder([FromBody] List<ReorderBannerRequest> items)
    {
        var result = await _bannerService.ReorderAsync(items);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPatch("{id}/toggle-publish")]
    public async Task<ActionResult<ApiResponse<bool>>> TogglePublish(string id)
    {
        var result = await _bannerService.TogglePublishAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPatch("{id}/toggle-featured")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleFeatured(string id)
    {
        var result = await _bannerService.ToggleFeaturedAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPatch("{id}/archive")]
    public async Task<ActionResult<ApiResponse<bool>>> Archive(string id)
    {
        var result = await _bannerService.ArchiveAsync(id);
        return Ok(result);
    }
}
