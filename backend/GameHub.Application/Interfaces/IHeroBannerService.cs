using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.HeroBanner;

namespace GameHub.Application.Interfaces;

public interface IHeroBannerService
{
    Task<ApiResponse<List<HeroBannerDto>>> GetAllAsync();
    Task<ApiResponse<List<HeroBannerDto>>> GetPublishedAsync();
    Task<ApiResponse<List<HeroBannerDto>>> GetFeaturedAsync();
    Task<ApiResponse<HeroBannerDto>> GetByIdAsync(string id);
    Task<ApiResponse<HeroBannerDto>> CreateAsync(CreateHeroBannerRequest request);
    Task<ApiResponse<HeroBannerDto>> UpdateAsync(string id, UpdateHeroBannerRequest request);
    Task<ApiResponse<bool>> DeleteAsync(string id);
    Task<ApiResponse<HeroBannerDto>> DuplicateAsync(string id);
    Task<ApiResponse<bool>> ReorderAsync(List<ReorderBannerRequest> items);
    Task<ApiResponse<bool>> TogglePublishAsync(string id);
    Task<ApiResponse<bool>> ToggleFeaturedAsync(string id);
    Task<ApiResponse<bool>> ArchiveAsync(string id);
}
