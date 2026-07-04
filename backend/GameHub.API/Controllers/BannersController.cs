using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameHub.Application.DTOs.Banner;
using GameHub.Application.DTOs.Common;
using GameHub.Application.Interfaces;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly IBannerService _bannerService;

    public BannersController(IBannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<List<BannerDto>>>> GetActive()
    {
        var result = await _bannerService.GetActiveAsync();
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<BannerDto>>>> GetAll()
    {
        var result = await _bannerService.GetAllAsync();
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<BannerDto>>> GetById(string id)
    {
        var result = await _bannerService.GetByIdAsync(id);
        return result.StatusCode == 404 ? NotFound(result) : Ok(result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BannerDto>>> Create([FromBody] CreateBannerRequest request)
    {
        var result = await _bannerService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<BannerDto>>> Update(string id, [FromBody] UpdateBannerRequest request)
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
}
