using GameHub.Application.DTOs.Auth;
using GameHub.Application.DTOs.Common;

namespace GameHub.Application.Services;

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<bool>> LogoutAsync(string userId);
    Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ApiResponse<bool>> VerifyResetCodeAsync(VerifyResetCodeRequest request);
    Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request);
    Task<ApiResponse<bool>> VerifyEmailAsync(VerifyEmailRequest request);
    Task<ApiResponse<AuthResponse>> SocialLoginAsync(SocialLoginRequest request);
    Task<ApiResponse<bool>> EnableTwoFactorAsync(string userId);
    Task<ApiResponse<bool>> DisableTwoFactorAsync(string userId);
    Task<ApiResponse<bool>> ChangePasswordAsync(string userId, ChangePasswordRequest request);
}
