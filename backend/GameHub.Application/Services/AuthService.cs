using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using GameHub.Application.DTOs.Auth;
using GameHub.Application.DTOs.Common;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;

namespace GameHub.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService, IEmailService emailService, ICacheService cacheService, ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return ApiResponse<AuthResponse>.BadRequest("User already exists");

        var user = new User
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName,
            Phone = request.Phone,
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return ApiResponse<AuthResponse>.BadRequest("Registration failed", result.Errors.Select(e => e.Description).ToList());

        await _userManager.AddToRoleAsync(user, "Customer");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        await _emailService.SendEmailAsync(user.Email!, "Verify your email", $"Your verification token: {token}");

        var authResponse = await GenerateAuthResponseAsync(user);

        _logger.LogInformation("User {Email} registered successfully", user.Email!);
        return ApiResponse<AuthResponse>.Ok(authResponse, "Registration successful. Please verify your email.");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return ApiResponse<AuthResponse>.BadRequest("Invalid credentials");

        if (!user.IsActive || user.IsBlocked)
            return ApiResponse<AuthResponse>.Forbidden("Account is blocked");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (result.IsLockedOut)
            return ApiResponse<AuthResponse>.BadRequest("Account is locked");

        if (!result.Succeeded)
            return ApiResponse<AuthResponse>.BadRequest("Invalid credentials");

        if (user.TwoFactorEnabled)
        {
            var twoFactorToken = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
            await _emailService.SendEmailAsync(user.Email!, "2FA Code", $"Your verification code: {twoFactorToken}");
            return ApiResponse<AuthResponse>.Ok(new AuthResponse(user.Id, user.Email!, user.FullName, user.ProfilePictureUrl, string.Empty, string.Empty, DateTime.MinValue, new List<string>()), "2FA token sent");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var authResponse = await GenerateAuthResponseAsync(user);
        _logger.LogInformation("User {Email} logged in", user.Email!);
        return ApiResponse<AuthResponse>.Ok(authResponse, "Login successful");
    }

    public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null)
            return ApiResponse<AuthResponse>.Unauthorized("Invalid token");

        var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return ApiResponse<AuthResponse>.Unauthorized("Invalid refresh token");

        var authResponse = await GenerateAuthResponseAsync(user);
        return ApiResponse<AuthResponse>.Ok(authResponse, "Token refreshed");
    }

    public async Task<ApiResponse<bool>> LogoutAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _userManager.UpdateAsync(user);
        }
        return ApiResponse<bool>.Ok(true, "Logged out");
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return ApiResponse<bool>.BadRequest("Email not found");

        var code = new Random().Next(100000, 999999).ToString();
        user.ResetPasswordToken = code;
        user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddMinutes(30);
        await _userManager.UpdateAsync(user);

        await _emailService.SendEmailAsync(user.Email!, "Password Reset Code", $"Your verification code is: {code}. This code expires in 30 minutes.");
        return ApiResponse<bool>.Ok(true, "Verification code sent to your email");
    }

    public async Task<ApiResponse<bool>> VerifyResetCodeAsync(VerifyResetCodeRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.ResetPasswordToken != request.Code || user.ResetPasswordTokenExpiry < DateTime.UtcNow)
            return ApiResponse<bool>.BadRequest("Invalid or expired verification code");

        return ApiResponse<bool>.Ok(true, "Code verified successfully");
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            return ApiResponse<bool>.BadRequest("Passwords do not match");

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.ResetPasswordToken != request.Code || user.ResetPasswordTokenExpiry < DateTime.UtcNow)
            return ApiResponse<bool>.BadRequest("Invalid or expired verification code");

        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;

        var removeResult = await _userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
            return ApiResponse<bool>.BadRequest("Failed to reset password");

        var addResult = await _userManager.AddPasswordAsync(user, request.Password);
        if (!addResult.Succeeded)
        {
            await _userManager.UpdateAsync(user);
            return ApiResponse<bool>.BadRequest("Password must be at least 8 characters with uppercase, lowercase & a digit", addResult.Errors.Select(e => e.Description).ToList());
        }

        await _userManager.UpdateAsync(user);
        return ApiResponse<bool>.Ok(true, "Password reset successful");
    }

    public async Task<ApiResponse<bool>> VerifyEmailAsync(VerifyEmailRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return ApiResponse<bool>.BadRequest("Invalid request");

        var result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
            return ApiResponse<bool>.BadRequest("Verification failed");

        return ApiResponse<bool>.Ok(true, "Email verified");
    }

    public async Task<ApiResponse<AuthResponse>> SocialLoginAsync(SocialLoginRequest request)
    {
        return ApiResponse<AuthResponse>.Ok(null!, "Social login is not implemented yet");
    }

    public async Task<ApiResponse<bool>> EnableTwoFactorAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return ApiResponse<bool>.NotFound("User not found");
        user.TwoFactorEnabled = true;
        await _userManager.UpdateAsync(user);
        return ApiResponse<bool>.Ok(true, "2FA enabled");
    }

    public async Task<ApiResponse<bool>> DisableTwoFactorAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return ApiResponse<bool>.NotFound("User not found");
        user.TwoFactorEnabled = false;
        await _userManager.UpdateAsync(user);
        return ApiResponse<bool>.Ok(true, "2FA disabled");
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return ApiResponse<bool>.NotFound("User not found");
        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return ApiResponse<bool>.BadRequest("Password change failed", result.Errors.Select(e => e.Description).ToList());
        return ApiResponse<bool>.Ok(true, "Password changed");
    }

    private async Task<AuthResponse> GenerateAuthResponseAsync(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(15);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return new AuthResponse(user.Id, user.Email!, user.FullName, user.ProfilePictureUrl, accessToken, refreshToken, expiresAt, roles.ToList());
    }
}
