using AutoMapper;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Banner;
using GameHub.Application.DTOs.Common;
using GameHub.Application.Interfaces;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;

namespace GameHub.Application.Services;

public class BannerService : IBannerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public BannerService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<BannerDto>>> GetAllAsync()
    {
        var banners = await _unitOfWork.Repository<Banner>().Query()
            .Where(b => !b.IsDeleted)
            .OrderBy(b => b.SortOrder)
            .Include(b => b.Game)
            .ToListAsync();

        var dtos = banners.Select(b => new BannerDto(
            b.Id, b.Title, b.Subtitle, b.ImageUrl, b.YoutubeUrl,
            b.GameId, b.Game?.Name, b.Game?.Slug,
            b.LinkUrl, b.ButtonText, b.BackgroundColor,
            b.SortOrder, b.IsActive, b.CreatedAt
        )).ToList();

        return ApiResponse<List<BannerDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<BannerDto>> GetByIdAsync(string id)
    {
        var banner = await _unitOfWork.Repository<Banner>().Query()
            .Where(b => b.Id == id && !b.IsDeleted)
            .Include(b => b.Game)
            .FirstOrDefaultAsync();

        if (banner == null)
            return ApiResponse<BannerDto>.NotFound("Banner not found");

        var dto = new BannerDto(
            banner.Id, banner.Title, banner.Subtitle, banner.ImageUrl, banner.YoutubeUrl,
            banner.GameId, banner.Game?.Name, banner.Game?.Slug,
            banner.LinkUrl, banner.ButtonText, banner.BackgroundColor,
            banner.SortOrder, banner.IsActive, banner.CreatedAt
        );

        return ApiResponse<BannerDto>.Ok(dto);
    }

    public async Task<ApiResponse<BannerDto>> CreateAsync(CreateBannerRequest request)
    {
        var banner = new Banner
        {
            Title = request.Title,
            Subtitle = request.Subtitle,
            ImageUrl = request.ImageUrl,
            YoutubeUrl = request.YoutubeUrl,
            GameId = request.GameId,
            LinkUrl = request.LinkUrl,
            ButtonText = request.ButtonText,
            BackgroundColor = request.BackgroundColor,
            SortOrder = request.SortOrder,
            IsActive = request.IsActive
        };

        await _unitOfWork.Repository<Banner>().AddAsync(banner);
        await _unitOfWork.SaveChangesAsync();

        var dto = new BannerDto(
            banner.Id, banner.Title, banner.Subtitle, banner.ImageUrl, banner.YoutubeUrl,
            banner.GameId, null, null,
            banner.LinkUrl, banner.ButtonText, banner.BackgroundColor,
            banner.SortOrder, banner.IsActive, banner.CreatedAt
        );

        return ApiResponse<BannerDto>.Created(dto, "Banner created");
    }

    public async Task<ApiResponse<BannerDto>> UpdateAsync(string id, UpdateBannerRequest request)
    {
        var banner = await _unitOfWork.Repository<Banner>().GetByIdAsync(id);
        if (banner == null || banner.IsDeleted)
            return ApiResponse<BannerDto>.NotFound("Banner not found");

        banner.Title = request.Title;
        banner.Subtitle = request.Subtitle;
        banner.ImageUrl = request.ImageUrl;
        banner.YoutubeUrl = request.YoutubeUrl;
        banner.GameId = request.GameId;
        banner.LinkUrl = request.LinkUrl;
        banner.ButtonText = request.ButtonText;
        banner.BackgroundColor = request.BackgroundColor;
        banner.SortOrder = request.SortOrder;
        banner.IsActive = request.IsActive;

        _unitOfWork.Repository<Banner>().Update(banner);
        await _unitOfWork.SaveChangesAsync();

        var dto = new BannerDto(
            banner.Id, banner.Title, banner.Subtitle, banner.ImageUrl, banner.YoutubeUrl,
            banner.GameId, null, null,
            banner.LinkUrl, banner.ButtonText, banner.BackgroundColor,
            banner.SortOrder, banner.IsActive, banner.CreatedAt
        );

        return ApiResponse<BannerDto>.Ok(dto, "Banner updated");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(string id)
    {
        var banner = await _unitOfWork.Repository<Banner>().GetByIdAsync(id);
        if (banner == null)
            return ApiResponse<bool>.NotFound("Banner not found");

        _unitOfWork.Repository<Banner>().Delete(banner);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Banner deleted");
    }

    public async Task<ApiResponse<List<BannerDto>>> GetActiveAsync()
    {
        var banners = await _unitOfWork.Repository<Banner>().Query()
            .Where(b => b.IsActive && !b.IsDeleted)
            .OrderBy(b => b.SortOrder)
            .Include(b => b.Game)
            .ToListAsync();

        var dtos = banners.Select(b => new BannerDto(
            b.Id, b.Title, b.Subtitle, b.ImageUrl, b.YoutubeUrl,
            b.GameId, b.Game?.Name, b.Game?.Slug,
            b.LinkUrl, b.ButtonText, b.BackgroundColor,
            b.SortOrder, b.IsActive, b.CreatedAt
        )).ToList();

        return ApiResponse<List<BannerDto>>.Ok(dtos);
    }
}
