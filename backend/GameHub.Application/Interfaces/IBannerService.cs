using GameHub.Application.DTOs.Banner;
using GameHub.Application.DTOs.Common;

namespace GameHub.Application.Interfaces;

public interface IBannerService
{
    Task<ApiResponse<List<BannerDto>>> GetAllAsync();
    Task<ApiResponse<BannerDto>> GetByIdAsync(string id);
    Task<ApiResponse<BannerDto>> CreateAsync(CreateBannerRequest request);
    Task<ApiResponse<BannerDto>> UpdateAsync(string id, UpdateBannerRequest request);
    Task<ApiResponse<bool>> DeleteAsync(string id);
    Task<ApiResponse<List<BannerDto>>> GetActiveAsync();
}
