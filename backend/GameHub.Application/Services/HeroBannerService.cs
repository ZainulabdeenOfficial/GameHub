using AutoMapper;
using Microsoft.EntityFrameworkCore;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.HeroBanner;
using GameHub.Application.Interfaces;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;

namespace GameHub.Application.Services;

public class HeroBannerService : IHeroBannerService
{
    private readonly IUnitOfWork _unitOfWork;

    public HeroBannerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<List<HeroBannerDto>>> GetAllAsync()
    {
        var banners = await _unitOfWork.Repository<HeroBanner>().Query()
            .Where(b => !b.IsDeleted && !b.IsArchived)
            .OrderBy(b => b.SortOrder).ThenByDescending(b => b.Priority)
            .Include(b => b.Game)
            .ToListAsync();

        return ApiResponse<List<HeroBannerDto>>.Ok(banners.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<List<HeroBannerDto>>> GetPublishedAsync()
    {
        var now = DateTime.UtcNow;
        var banners = await _unitOfWork.Repository<HeroBanner>().Query()
            .Where(b => b.IsPublished && !b.IsDeleted && !b.IsArchived)
            .Where(b => b.PublishStartDate == null || b.PublishStartDate <= now)
            .Where(b => b.PublishEndDate == null || b.PublishEndDate >= now)
            .OrderBy(b => b.SortOrder).ThenByDescending(b => b.Priority)
            .Include(b => b.Game)
            .ToListAsync();

        return ApiResponse<List<HeroBannerDto>>.Ok(banners.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<List<HeroBannerDto>>> GetFeaturedAsync()
    {
        var now = DateTime.UtcNow;
        var banners = await _unitOfWork.Repository<HeroBanner>().Query()
            .Where(b => b.IsFeatured && b.IsPublished && !b.IsDeleted && !b.IsArchived)
            .Where(b => b.PublishStartDate == null || b.PublishStartDate <= now)
            .Where(b => b.PublishEndDate == null || b.PublishEndDate >= now)
            .OrderBy(b => b.SortOrder).ThenByDescending(b => b.Priority)
            .Include(b => b.Game)
            .ToListAsync();

        return ApiResponse<List<HeroBannerDto>>.Ok(banners.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<HeroBannerDto>> GetByIdAsync(string id)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().Query()
            .Where(b => b.Id == id && !b.IsDeleted)
            .Include(b => b.Game)
            .FirstOrDefaultAsync();

        if (banner == null)
            return ApiResponse<HeroBannerDto>.NotFound("Banner not found");

        return ApiResponse<HeroBannerDto>.Ok(MapToDto(banner));
    }

    public async Task<ApiResponse<HeroBannerDto>> CreateAsync(CreateHeroBannerRequest request)
    {
        var banner = new HeroBanner
        {
            Title = request.Title,
            Subtitle = request.Subtitle,
            Description = request.Description,
            Badge = request.Badge,
            DiscountPercentage = request.DiscountPercentage,
            PrimaryButtonText = request.PrimaryButtonText,
            PrimaryButtonUrl = request.PrimaryButtonUrl,
            SecondaryButtonText = request.SecondaryButtonText,
            SecondaryButtonUrl = request.SecondaryButtonUrl,
            GameId = request.GameId,
            GameName = request.GameName,
            CategoryName = request.CategoryName,
            PlatformName = request.PlatformName,
            OverlayOpacity = request.OverlayOpacity,
            OverlayColor = request.OverlayColor,
            TextColor = request.TextColor,
            FontFamily = request.FontFamily,
            FontSize = request.FontSize,
            FontWeight = request.FontWeight,
            ButtonStyle = request.ButtonStyle,
            ButtonColor = request.ButtonColor,
            ButtonHoverColor = request.ButtonHoverColor,
            HorizontalAlignment = request.HorizontalAlignment,
            VerticalAlignment = request.VerticalAlignment,
            BackgroundType = request.BackgroundType,
            ImageUrl = request.ImageUrl,
            VideoUrl = request.VideoUrl,
            YoutubeUrl = request.YoutubeUrl,
            Mp4Url = request.Mp4Url,
            WebMUrl = request.WebMUrl,
            SolidColor = request.SolidColor,
            GradientStart = request.GradientStart,
            GradientEnd = request.GradientEnd,
            GradientDirection = request.GradientDirection,
            AnimatedBackground = request.AnimatedBackground,
            LottieUrl = request.LottieUrl,
            ThreeJsEnabled = request.ThreeJsEnabled,
            ParticleEnabled = request.ParticleEnabled,
            ParticleType = request.ParticleType,
            BackgroundLayers = request.BackgroundLayers,
            FloatingObjects = request.FloatingObjects,
            FloatingControllers = request.FloatingControllers,
            FloatingCds = request.FloatingCds,
            FloatingCubes = request.FloatingCubes,
            TextAnimation = request.TextAnimation,
            AutoplayEnabled = request.AutoplayEnabled,
            InfiniteLoopEnabled = request.InfiniteLoopEnabled,
            CarouselTransitionSpeed = request.CarouselTransitionSpeed,
            CarouselAnimationType = request.CarouselAnimationType,
            PauseOnHover = request.PauseOnHover,
            SortOrder = request.SortOrder,
            Priority = request.Priority,
            IsPublished = request.IsPublished,
            IsFeatured = request.IsFeatured,
            IsArchived = request.IsArchived,
            PublishStartDate = request.PublishStartDate,
            PublishEndDate = request.PublishEndDate,
            PrimaryColor = request.PrimaryColor,
            SecondaryColor = request.SecondaryColor,
            AccentColor = request.AccentColor,
            BgColor = request.BgColor,
            HeroHeight = request.HeroHeight,
            HeroWidth = request.HeroWidth,
            CssBorderRadius = request.CssBorderRadius,
            CssShadow = request.CssShadow,
            CssSpacing = request.CssSpacing,
            CssPadding = request.CssPadding,
            CssMargins = request.CssMargins,
            AnimationDuration = request.AnimationDuration,
            TransitionSpeed = request.TransitionSpeed,
            DesktopSettings = request.DesktopSettings,
            TabletSettings = request.TabletSettings,
            MobileSettings = request.MobileSettings
        };

        await _unitOfWork.Repository<HeroBanner>().AddAsync(banner);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<HeroBannerDto>.Created(MapToDto(banner), "Banner created");
    }

    public async Task<ApiResponse<HeroBannerDto>> UpdateAsync(string id, UpdateHeroBannerRequest request)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().GetByIdAsync(id);
        if (banner == null || banner.IsDeleted)
            return ApiResponse<HeroBannerDto>.NotFound("Banner not found");

        if (request.Title != null) banner.Title = request.Title;
        if (request.Subtitle != null) banner.Subtitle = request.Subtitle;
        if (request.Description != null) banner.Description = request.Description;
        if (request.Badge != null) banner.Badge = request.Badge;
        if (request.DiscountPercentage.HasValue) banner.DiscountPercentage = request.DiscountPercentage;
        if (request.PrimaryButtonText != null) banner.PrimaryButtonText = request.PrimaryButtonText;
        if (request.PrimaryButtonUrl != null) banner.PrimaryButtonUrl = request.PrimaryButtonUrl;
        if (request.SecondaryButtonText != null) banner.SecondaryButtonText = request.SecondaryButtonText;
        if (request.SecondaryButtonUrl != null) banner.SecondaryButtonUrl = request.SecondaryButtonUrl;
        if (request.GameId != null) banner.GameId = request.GameId;
        if (request.GameName != null) banner.GameName = request.GameName;
        if (request.CategoryName != null) banner.CategoryName = request.CategoryName;
        if (request.PlatformName != null) banner.PlatformName = request.PlatformName;
        if (request.OverlayOpacity.HasValue) banner.OverlayOpacity = request.OverlayOpacity.Value;
        if (request.OverlayColor != null) banner.OverlayColor = request.OverlayColor;
        if (request.TextColor != null) banner.TextColor = request.TextColor;
        if (request.FontFamily != null) banner.FontFamily = request.FontFamily;
        if (request.FontSize != null) banner.FontSize = request.FontSize;
        if (request.FontWeight != null) banner.FontWeight = request.FontWeight;
        if (request.ButtonStyle != null) banner.ButtonStyle = request.ButtonStyle;
        if (request.ButtonColor != null) banner.ButtonColor = request.ButtonColor;
        if (request.ButtonHoverColor != null) banner.ButtonHoverColor = request.ButtonHoverColor;
        if (request.HorizontalAlignment != null) banner.HorizontalAlignment = request.HorizontalAlignment;
        if (request.VerticalAlignment != null) banner.VerticalAlignment = request.VerticalAlignment;
        if (request.BackgroundType != null) banner.BackgroundType = request.BackgroundType;
        if (request.ImageUrl != null) banner.ImageUrl = request.ImageUrl;
        if (request.VideoUrl != null) banner.VideoUrl = request.VideoUrl;
        if (request.YoutubeUrl != null) banner.YoutubeUrl = request.YoutubeUrl;
        if (request.Mp4Url != null) banner.Mp4Url = request.Mp4Url;
        if (request.WebMUrl != null) banner.WebMUrl = request.WebMUrl;
        if (request.SolidColor != null) banner.SolidColor = request.SolidColor;
        if (request.GradientStart != null) banner.GradientStart = request.GradientStart;
        if (request.GradientEnd != null) banner.GradientEnd = request.GradientEnd;
        if (request.GradientDirection != null) banner.GradientDirection = request.GradientDirection;
        if (request.AnimatedBackground.HasValue) banner.AnimatedBackground = request.AnimatedBackground.Value;
        if (request.LottieUrl != null) banner.LottieUrl = request.LottieUrl;
        if (request.ThreeJsEnabled.HasValue) banner.ThreeJsEnabled = request.ThreeJsEnabled.Value;
        if (request.ParticleEnabled.HasValue) banner.ParticleEnabled = request.ParticleEnabled.Value;
        if (request.ParticleType != null) banner.ParticleType = request.ParticleType;
        if (request.BackgroundLayers != null) banner.BackgroundLayers = request.BackgroundLayers;
        if (request.FloatingObjects.HasValue) banner.FloatingObjects = request.FloatingObjects.Value;
        if (request.FloatingControllers.HasValue) banner.FloatingControllers = request.FloatingControllers.Value;
        if (request.FloatingCds.HasValue) banner.FloatingCds = request.FloatingCds.Value;
        if (request.FloatingCubes.HasValue) banner.FloatingCubes = request.FloatingCubes.Value;
        if (request.TextAnimation != null) banner.TextAnimation = request.TextAnimation;
        if (request.AutoplayEnabled.HasValue) banner.AutoplayEnabled = request.AutoplayEnabled.Value;
        if (request.InfiniteLoopEnabled.HasValue) banner.InfiniteLoopEnabled = request.InfiniteLoopEnabled.Value;
        if (request.CarouselTransitionSpeed.HasValue) banner.CarouselTransitionSpeed = request.CarouselTransitionSpeed.Value;
        if (request.CarouselAnimationType != null) banner.CarouselAnimationType = request.CarouselAnimationType;
        if (request.PauseOnHover.HasValue) banner.PauseOnHover = request.PauseOnHover.Value;
        if (request.SortOrder.HasValue) banner.SortOrder = request.SortOrder.Value;
        if (request.Priority.HasValue) banner.Priority = request.Priority.Value;
        if (request.IsPublished.HasValue) banner.IsPublished = request.IsPublished.Value;
        if (request.IsFeatured.HasValue) banner.IsFeatured = request.IsFeatured.Value;
        if (request.IsArchived.HasValue) banner.IsArchived = request.IsArchived.Value;
        if (request.PublishStartDate != null) banner.PublishStartDate = request.PublishStartDate;
        if (request.PublishEndDate != null) banner.PublishEndDate = request.PublishEndDate;
        if (request.PrimaryColor != null) banner.PrimaryColor = request.PrimaryColor;
        if (request.SecondaryColor != null) banner.SecondaryColor = request.SecondaryColor;
        if (request.AccentColor != null) banner.AccentColor = request.AccentColor;
        if (request.BgColor != null) banner.BgColor = request.BgColor;
        if (request.HeroHeight != null) banner.HeroHeight = request.HeroHeight;
        if (request.HeroWidth != null) banner.HeroWidth = request.HeroWidth;
        if (request.CssBorderRadius != null) banner.CssBorderRadius = request.CssBorderRadius;
        if (request.CssShadow != null) banner.CssShadow = request.CssShadow;
        if (request.CssSpacing != null) banner.CssSpacing = request.CssSpacing;
        if (request.CssPadding != null) banner.CssPadding = request.CssPadding;
        if (request.CssMargins != null) banner.CssMargins = request.CssMargins;
        if (request.AnimationDuration.HasValue) banner.AnimationDuration = request.AnimationDuration.Value;
        if (request.TransitionSpeed.HasValue) banner.TransitionSpeed = request.TransitionSpeed.Value;
        if (request.DesktopSettings != null) banner.DesktopSettings = request.DesktopSettings;
        if (request.TabletSettings != null) banner.TabletSettings = request.TabletSettings;
        if (request.MobileSettings != null) banner.MobileSettings = request.MobileSettings;

        _unitOfWork.Repository<HeroBanner>().Update(banner);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<HeroBannerDto>.Ok(MapToDto(banner), "Banner updated");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(string id)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().GetByIdAsync(id);
        if (banner == null)
            return ApiResponse<bool>.NotFound("Banner not found");

        _unitOfWork.Repository<HeroBanner>().Delete(banner);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Banner deleted");
    }

    public async Task<ApiResponse<HeroBannerDto>> DuplicateAsync(string id)
    {
        var source = await _unitOfWork.Repository<HeroBanner>().Query()
            .Include(b => b.Game).FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted);
        if (source == null)
            return ApiResponse<HeroBannerDto>.NotFound("Banner not found");

        var maxOrder = await _unitOfWork.Repository<HeroBanner>().Query()
            .MaxAsync(b => (int?)b.SortOrder) ?? 0;

        var clone = new HeroBanner
        {
            Title = source.Title + " (Copy)",
            Subtitle = source.Subtitle,
            Description = source.Description,
            Badge = source.Badge,
            DiscountPercentage = source.DiscountPercentage,
            PrimaryButtonText = source.PrimaryButtonText,
            PrimaryButtonUrl = source.PrimaryButtonUrl,
            SecondaryButtonText = source.SecondaryButtonText,
            SecondaryButtonUrl = source.SecondaryButtonUrl,
            GameId = source.GameId,
            GameName = source.GameName,
            CategoryName = source.CategoryName,
            PlatformName = source.PlatformName,
            OverlayOpacity = source.OverlayOpacity,
            OverlayColor = source.OverlayColor,
            TextColor = source.TextColor,
            FontFamily = source.FontFamily,
            FontSize = source.FontSize,
            FontWeight = source.FontWeight,
            ButtonStyle = source.ButtonStyle,
            ButtonColor = source.ButtonColor,
            ButtonHoverColor = source.ButtonHoverColor,
            HorizontalAlignment = source.HorizontalAlignment,
            VerticalAlignment = source.VerticalAlignment,
            BackgroundType = source.BackgroundType,
            ImageUrl = source.ImageUrl,
            VideoUrl = source.VideoUrl,
            YoutubeUrl = source.YoutubeUrl,
            Mp4Url = source.Mp4Url,
            WebMUrl = source.WebMUrl,
            SolidColor = source.SolidColor,
            GradientStart = source.GradientStart,
            GradientEnd = source.GradientEnd,
            GradientDirection = source.GradientDirection,
            AnimatedBackground = source.AnimatedBackground,
            LottieUrl = source.LottieUrl,
            ThreeJsEnabled = source.ThreeJsEnabled,
            ParticleEnabled = source.ParticleEnabled,
            ParticleType = source.ParticleType,
            BackgroundLayers = source.BackgroundLayers,
            FloatingObjects = source.FloatingObjects,
            FloatingControllers = source.FloatingControllers,
            FloatingCds = source.FloatingCds,
            FloatingCubes = source.FloatingCubes,
            TextAnimation = source.TextAnimation,
            AutoplayEnabled = source.AutoplayEnabled,
            InfiniteLoopEnabled = source.InfiniteLoopEnabled,
            CarouselTransitionSpeed = source.CarouselTransitionSpeed,
            CarouselAnimationType = source.CarouselAnimationType,
            PauseOnHover = source.PauseOnHover,
            SortOrder = maxOrder + 1,
            Priority = source.Priority,
            IsPublished = false,
            IsFeatured = false,
            IsArchived = false,
            PublishStartDate = null,
            PublishEndDate = null,
            PrimaryColor = source.PrimaryColor,
            SecondaryColor = source.SecondaryColor,
            AccentColor = source.AccentColor,
            BgColor = source.BgColor,
            HeroHeight = source.HeroHeight,
            HeroWidth = source.HeroWidth,
            CssBorderRadius = source.CssBorderRadius,
            CssShadow = source.CssShadow,
            CssSpacing = source.CssSpacing,
            CssPadding = source.CssPadding,
            CssMargins = source.CssMargins,
            AnimationDuration = source.AnimationDuration,
            TransitionSpeed = source.TransitionSpeed,
            DesktopSettings = source.DesktopSettings,
            TabletSettings = source.TabletSettings,
            MobileSettings = source.MobileSettings
        };

        await _unitOfWork.Repository<HeroBanner>().AddAsync(clone);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<HeroBannerDto>.Created(MapToDto(clone), "Banner duplicated");
    }

    public async Task<ApiResponse<bool>> ReorderAsync(List<ReorderBannerRequest> items)
    {
        var repo = _unitOfWork.Repository<HeroBanner>();
        foreach (var item in items)
        {
            var banner = await repo.GetByIdAsync(item.Id);
            if (banner != null)
            {
                banner.SortOrder = item.SortOrder;
                repo.Update(banner);
            }
        }
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Order updated");
    }

    public async Task<ApiResponse<bool>> TogglePublishAsync(string id)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().GetByIdAsync(id);
        if (banner == null) return ApiResponse<bool>.NotFound("Banner not found");
        banner.IsPublished = !banner.IsPublished;
        _unitOfWork.Repository<HeroBanner>().Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, banner.IsPublished ? "Banner published" : "Banner unpublished");
    }

    public async Task<ApiResponse<bool>> ToggleFeaturedAsync(string id)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().GetByIdAsync(id);
        if (banner == null) return ApiResponse<bool>.NotFound("Banner not found");
        banner.IsFeatured = !banner.IsFeatured;
        _unitOfWork.Repository<HeroBanner>().Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, banner.IsFeatured ? "Marked as featured" : "Unmarked as featured");
    }

    public async Task<ApiResponse<bool>> ArchiveAsync(string id)
    {
        var banner = await _unitOfWork.Repository<HeroBanner>().GetByIdAsync(id);
        if (banner == null) return ApiResponse<bool>.NotFound("Banner not found");
        banner.IsArchived = true;
        _unitOfWork.Repository<HeroBanner>().Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Banner archived");
    }

    private static HeroBannerDto MapToDto(HeroBanner b)
    {
        return new HeroBannerDto(
            b.Id, b.Title, b.Subtitle, b.Description,
            b.Badge, b.DiscountPercentage,
            b.PrimaryButtonText, b.PrimaryButtonUrl,
            b.SecondaryButtonText, b.SecondaryButtonUrl,
            b.GameId, b.Game?.Name ?? b.GameName, b.Game?.Slug,
            b.CategoryName, b.PlatformName,
            b.OverlayOpacity, b.OverlayColor,
            b.TextColor, b.FontFamily, b.FontSize, b.FontWeight,
            b.ButtonStyle, b.ButtonColor, b.ButtonHoverColor,
            b.HorizontalAlignment, b.VerticalAlignment,
            b.BackgroundType, b.ImageUrl, b.VideoUrl,
            b.YoutubeUrl, b.Mp4Url, b.WebMUrl,
            b.SolidColor, b.GradientStart, b.GradientEnd, b.GradientDirection,
            b.AnimatedBackground, b.LottieUrl, b.ThreeJsEnabled,
            b.ParticleEnabled, b.ParticleType, b.BackgroundLayers,
            b.FloatingObjects, b.FloatingControllers, b.FloatingCds, b.FloatingCubes,
            b.TextAnimation,
            b.AutoplayEnabled, b.InfiniteLoopEnabled, b.CarouselTransitionSpeed,
            b.CarouselAnimationType, b.PauseOnHover,
            b.SortOrder, b.Priority, b.IsPublished, b.IsFeatured, b.IsArchived,
            b.PublishStartDate, b.PublishEndDate,
            b.PrimaryColor, b.SecondaryColor, b.AccentColor, b.BgColor,
            b.HeroHeight, b.HeroWidth, b.CssBorderRadius, b.CssShadow,
            b.CssSpacing, b.CssPadding, b.CssMargins,
            b.AnimationDuration, b.TransitionSpeed,
            b.DesktopSettings, b.TabletSettings, b.MobileSettings,
            b.CreatedAt, b.UpdatedAt
        );
    }
}
