using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Persistence.Context;

namespace GameHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactMessagesController : ControllerBase
{
    private readonly GameHubDbContext _context;

    public ContactMessagesController(GameHubDbContext context) { _context = context; }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContactMessage>>> Create([FromBody] CreateContactMessageRequest request)
    {
        var msg = new ContactMessage
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            IsRead = false
        };
        _context.ContactMessages.Add(msg);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<ContactMessage>.Ok(msg, "Message sent successfully"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ContactMessage>>>> GetAll()
    {
        var messages = await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync();
        return Ok(ApiResponse<List<ContactMessage>>.Ok(messages));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ContactMessage>>> GetById(string id)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound(ApiResponse<ContactMessage>.NotFound());
        if (!msg.IsRead) { msg.IsRead = true; await _context.SaveChangesAsync(); }
        return Ok(ApiResponse<ContactMessage>.Ok(msg));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpPost("{id}/reply")]
    public async Task<ActionResult<ApiResponse<ContactMessage>>> Reply(string id, [FromBody] ReplyContactMessageRequest request)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound(ApiResponse<ContactMessage>.NotFound());
        msg.AdminReply = request.Reply;
        msg.RepliedAt = DateTime.UtcNow;
        msg.RepliedBy = User.Identity?.Name;
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<ContactMessage>.Ok(msg, "Reply sent"));
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(string id)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound(ApiResponse<bool>.NotFound());
        _context.ContactMessages.Remove(msg);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Message deleted"));
    }
}

public record CreateContactMessageRequest(string Name, string Email, string Subject, string Message);
public record ReplyContactMessageRequest(string Reply);
