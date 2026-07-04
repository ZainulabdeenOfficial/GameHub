using GameHub.Domain.Entities;

namespace GameHub.Domain.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IList<string>? roles = null);
    string GenerateRefreshToken();
    Task<string> GenerateEmailVerificationTokenAsync(User user);
    Task<string> GeneratePasswordResetTokenAsync(User user);
    bool ValidateRefreshToken(string refreshToken, string storedToken);
    System.Security.Claims.ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
