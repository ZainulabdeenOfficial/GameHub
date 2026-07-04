namespace GameHub.Application.DTOs.Auth;

public record RegisterRequest(string Email, string Password, string ConfirmPassword, string? FullName, string? Phone);
public record LoginRequest(string Email, string Password, bool RememberMe);
public record ForgotPasswordRequest(string Email);
public record VerifyResetCodeRequest(string Email, string Code);
public record ResetPasswordRequest(string Email, string Code, string Password, string ConfirmPassword);
public record VerifyEmailRequest(string Email, string Token);
public record RefreshTokenRequest(string AccessToken, string RefreshToken);
public record TwoFactorRequest(string Email, string Code, bool RememberDevice);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmNewPassword);

public record AuthResponse(
    string UserId,
    string Email,
    string? FullName,
    string? ProfilePictureUrl,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    IList<string> Roles
);

public record SocialLoginRequest(string Provider, string AccessToken);
