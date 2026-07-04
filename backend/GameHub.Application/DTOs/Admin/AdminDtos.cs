namespace GameHub.Application.DTOs.Admin;

public record CreateAdminRequest(string Email, string Password, string FullName, string? Phone);
public record UpdateAdminRoleRequest(string Role);
