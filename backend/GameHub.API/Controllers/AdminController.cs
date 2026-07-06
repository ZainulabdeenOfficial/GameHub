using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Admin;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Persistence.Context;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,Admin,Moderator")]
public class AdminController : ControllerBase
{
    private readonly GameHubDbContext _context;
    private readonly UserManager<User> _userManager;

    public AdminController(GameHubDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<object>>> GetDashboard()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalGames = await _context.Games.CountAsync(g => !g.IsDeleted);
        var activeUsers = await _context.Users.CountAsync(u => u.IsActive && u.LastLoginAt > DateTime.UtcNow.AddDays(-7));
        var newUsers = await _context.Users.CountAsync(u => u.CreatedAt > DateTime.UtcNow.AddDays(-30));
        var totalReviews = await _context.Reviews.CountAsync();
        var totalDownloads = await _context.Games.Where(g => !g.IsDeleted).SumAsync(g => g.TotalDownloads);

        return Ok(ApiResponse<object>.Ok(new
        {
            totalUsers,
            totalGames,
            activeUsers,
            newUsers,
            totalReviews,
            totalDownloads
        }));
    }

    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<List<User>>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(ApiResponse<List<User>>.Ok(users));
    }

    [HttpPut("users/{id}/block")]
    public async Task<ActionResult<ApiResponse<bool>>> BlockUser(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(ApiResponse<bool>.NotFound());
        user.IsBlocked = !user.IsBlocked;
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, user.IsBlocked ? "User blocked" : "User unblocked"));
    }

    [HttpGet("admins")]
    public async Task<ActionResult<ApiResponse<object>>> GetAdmins()
    {
        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin" || r.Name == "SuperAdmin");
        if (adminRole == null) return Ok(ApiResponse<object>.Ok(new List<object>()));

        var adminUserIds = await _context.UserRoles
            .Where(ur => ur.RoleId == adminRole.Id)
            .Select(ur => ur.UserId)
            .ToListAsync();

        var admins = await _context.Users
            .Where(u => adminUserIds.Contains(u.Id))
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.UserName,
                u.Phone,
                u.IsActive,
                u.IsBlocked,
                u.CreatedAt,
                u.LastLoginAt,
                Roles = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id)
                    .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(ApiResponse<object>.Ok(admins));
    }

    [HttpPost("admins")]
    public async Task<ActionResult<ApiResponse<bool>>> CreateAdmin([FromBody] CreateAdminRequest request)
    {
        var user = new User
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName,
            Phone = request.Phone,
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(ApiResponse<bool>.BadRequest("Failed to create admin", result.Errors.Select(e => e.Description).ToList()));

        await _userManager.AddToRoleAsync(user, "Admin");
        return Ok(ApiResponse<bool>.Ok(true, "Admin created successfully"));
    }

    [HttpPut("admins/{id}/role")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateAdminRole(string id, [FromBody] UpdateAdminRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(ApiResponse<bool>.NotFound("User not found"));

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, request.Role);

        return Ok(ApiResponse<bool>.Ok(true, "Role updated"));
    }

    [HttpDelete("admins/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteAdmin(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(ApiResponse<bool>.NotFound("User not found"));

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("SuperAdmin"))
            return BadRequest(ApiResponse<bool>.BadRequest("Cannot delete SuperAdmin"));

        await _userManager.DeleteAsync(user);
        return Ok(ApiResponse<bool>.Ok(true, "Admin deleted"));
    }
}
