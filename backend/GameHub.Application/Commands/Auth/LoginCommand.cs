using MediatR;
using GameHub.Application.DTOs.Auth;
using GameHub.Application.DTOs.Common;

namespace GameHub.Application.Commands.Auth;

public record LoginCommand(LoginRequest Request) : IRequest<ApiResponse<AuthResponse>>;
