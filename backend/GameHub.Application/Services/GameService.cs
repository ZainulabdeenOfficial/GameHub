using AutoMapper;
using Microsoft.Extensions.Logging;
using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.Game;
using GameHub.Application.Interfaces;
using GameHub.Domain.Entities;
using GameHub.Domain.Enums;
using GameHub.Domain.Interfaces;

namespace GameHub.Application.Services;

public class GameService : IGameService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGameRepository _gameRepository;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;
    private readonly ILogger<GameService> _logger;

    public GameService(IUnitOfWork unitOfWork, IGameRepository gameRepository, IMapper mapper, ICacheService cacheService, ILogger<GameService> logger)
    {
        _unitOfWork = unitOfWork;
        _gameRepository = gameRepository;
        _mapper = mapper;
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<ApiResponse<GameDto>> GetByIdAsync(string id)
    {
        var cacheKey = $"game_{id}";
        var cached = await _cacheService.GetAsync<GameDto>(cacheKey);
        if (cached?.CategoryName != null)
            return ApiResponse<GameDto>.Ok(cached);
        if (cached != null)
            await _cacheService.RemoveAsync(cacheKey);

        var game = await _gameRepository.GetGameWithDetailsAsync(id);
        if (game == null)
            return ApiResponse<GameDto>.NotFound("Game not found");

        var dto = _mapper.Map<GameDto>(game);
        if (dto.CategoryName != null)
            await _cacheService.SetAsync(cacheKey, dto, TimeSpan.FromMinutes(5));
        return ApiResponse<GameDto>.Ok(dto);
    }

    public async Task<ApiResponse<PagedResponse<List<GameListDto>>>> GetAllAsync(GameFilterRequest filter)
    {
        var query = _unitOfWork.Repository<Game>().Query().Where(g => !g.IsDeleted);

        if (!string.IsNullOrEmpty(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(g => g.Name.ToLower().Contains(search) || g.ShortDescription.ToLower().Contains(search));
        }
        if (!string.IsNullOrEmpty(filter.CategoryId))
            query = query.Where(g => g.CategoryId == filter.CategoryId);
        if (filter.Platform.HasValue)
            query = query.Where(g => g.Platform == filter.Platform.Value);
        if (!string.IsNullOrEmpty(filter.PublisherId))
            query = query.Where(g => g.PublisherId == filter.PublisherId);
        if (filter.MinRating.HasValue)
            query = query.Where(g => g.AverageRating >= filter.MinRating.Value);
        query = filter.SortBy?.ToLower() switch
        {
            "name" => filter.IsDescending == true ? query.OrderByDescending(g => g.Name) : query.OrderBy(g => g.Name),
            "rating" => query.OrderByDescending(g => g.AverageRating),
            "popular" => query.OrderByDescending(g => g.TotalDownloads),
            _ => query.OrderByDescending(g => g.CreatedAt)
        };

        var totalRecords = query.Count();
        var games = query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize).ToList();
        var gameDtos = _mapper.Map<List<GameListDto>>(games);

        var response = new PagedResponse<List<GameListDto>>
        {
            Data = gameDtos,
            Success = true,
            Message = "Success",
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalRecords = totalRecords,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)filter.PageSize),
            StatusCode = 200
        };

        return ApiResponse<PagedResponse<List<GameListDto>>>.Ok(response);
    }

    public async Task<ApiResponse<GameDto>> CreateAsync(CreateGameRequest request)
    {
        var slug = request.Name.ToLower().Replace(" ", "-").Replace("'", "");

        if (await _unitOfWork.Repository<Game>().ExistsAsync(g => g.Slug == slug && !g.IsDeleted))
            return ApiResponse<GameDto>.BadRequest("A game with this name already exists");

        if (string.IsNullOrWhiteSpace(request.CategoryId))
            return ApiResponse<GameDto>.BadRequest("Category is required");

        if (!await _unitOfWork.Repository<Category>().ExistsAsync(c => c.Id == request.CategoryId))
            return ApiResponse<GameDto>.BadRequest("Category not found");

        var publisherId = string.IsNullOrWhiteSpace(request.PublisherId) ? null : request.PublisherId;
        if (publisherId != null && !await _unitOfWork.Repository<Publisher>().ExistsAsync(p => p.Id == publisherId))
            return ApiResponse<GameDto>.BadRequest("Publisher not found");

        var developerId = string.IsNullOrWhiteSpace(request.DeveloperId) ? null : request.DeveloperId;
        if (developerId != null && !await _unitOfWork.Repository<Developer>().ExistsAsync(d => d.Id == developerId))
            return ApiResponse<GameDto>.BadRequest("Developer not found");

        var game = new Game
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            ShortDescription = request.ShortDescription,
            CategoryId = request.CategoryId,
            Platform = request.Platform,
            PublisherId = publisherId,
            DeveloperId = developerId,
            ReleaseDate = request.ReleaseDate,
            AgeRating = request.AgeRating,
            Languages = request.Languages,
            Genres = request.Genres,
            GameSize = request.GameSize,
            Version = request.Version,
            MinimumRequirements = request.MinimumRequirements,
            RecommendedRequirements = request.RecommendedRequirements,
            DownloadLink = request.DownloadLink,
            SteamLink = request.SteamLink,
            EpicLink = request.EpicLink,
            TrailerUrl = request.TrailerUrl,
            ThumbnailUrl = request.ThumbnailUrl,
            BannerUrl = request.BannerUrl,
            Status = request.Status,
            IsFeatured = request.IsFeatured,
            IsPopular = request.IsPopular,
            IsTrending = request.IsTrending,
            IsEditorsChoice = request.IsEditorsChoice
        };

        await _unitOfWork.Repository<Game>().AddAsync(game);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Game created: {Name}", game.Name);

        var created = await _gameRepository.GetGameWithDetailsAsync(game.Id);
        return ApiResponse<GameDto>.Created(_mapper.Map<GameDto>(created ?? game), "Game created successfully");
    }

    public async Task<ApiResponse<GameDto>> UpdateAsync(string id, UpdateGameRequest request)
    {
        var game = await _unitOfWork.Repository<Game>().GetByIdAsync(id);
        if (game == null || game.IsDeleted)
            return ApiResponse<GameDto>.NotFound("Game not found");

        if (request.Name != null) { game.Name = request.Name; game.Slug = request.Name.ToLower().Replace(" ", "-"); }
        if (request.Description != null) game.Description = request.Description;
        if (request.ShortDescription != null) game.ShortDescription = request.ShortDescription;
        if (!string.IsNullOrWhiteSpace(request.CategoryId))
        {
            var categoryExists = await _unitOfWork.Repository<Category>().ExistsAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
                return ApiResponse<GameDto>.BadRequest("Category not found");
            game.CategoryId = request.CategoryId;
        }
        if (request.Platform.HasValue) game.Platform = request.Platform.Value;
        if (!string.IsNullOrWhiteSpace(request.PublisherId))
        {
            var publisherExists = await _unitOfWork.Repository<Publisher>().ExistsAsync(p => p.Id == request.PublisherId);
            if (!publisherExists)
                return ApiResponse<GameDto>.BadRequest("Publisher not found");
            game.PublisherId = request.PublisherId;
        }
        if (!string.IsNullOrWhiteSpace(request.DeveloperId))
        {
            var developerExists = await _unitOfWork.Repository<Developer>().ExistsAsync(d => d.Id == request.DeveloperId);
            if (!developerExists)
                return ApiResponse<GameDto>.BadRequest("Developer not found");
            game.DeveloperId = request.DeveloperId;
        }
        if (request.Status.HasValue) game.Status = request.Status.Value;
        if (request.IsFeatured.HasValue) game.IsFeatured = request.IsFeatured.Value;
        if (request.IsPopular.HasValue) game.IsPopular = request.IsPopular.Value;
        if (request.IsTrending.HasValue) game.IsTrending = request.IsTrending.Value;
        if (request.GameSize.HasValue) game.GameSize = request.GameSize.Value;
        if (request.ThumbnailUrl != null) game.ThumbnailUrl = request.ThumbnailUrl;
        if (request.BannerUrl != null) game.BannerUrl = request.BannerUrl;

        _unitOfWork.Repository<Game>().Update(game);
        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync($"game_{id}");

        _logger.LogInformation("Game updated: {Name}", game.Name);

        var updated = await _gameRepository.GetGameWithDetailsAsync(id);
        return ApiResponse<GameDto>.Ok(_mapper.Map<GameDto>(updated ?? game), "Game updated");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(string id)
    {
        var game = await _unitOfWork.Repository<Game>().GetByIdAsync(id);
        if (game == null || game.IsDeleted)
            return ApiResponse<bool>.NotFound("Game not found");

        _unitOfWork.Repository<Game>().Delete(game);
        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync($"game_{id}");

        _logger.LogInformation("Game deleted: {Name}", game.Name);
        return ApiResponse<bool>.Ok(true, "Game deleted");
    }

    public async Task<ApiResponse<bool>> BulkDeleteAsync(List<string> ids)
    {
        var repo = _unitOfWork.Repository<Game>();
        foreach (var id in ids)
        {
            var game = await repo.GetByIdAsync(id);
            if (game != null && !game.IsDeleted)
            {
                repo.Delete(game);
                await _cacheService.RemoveAsync($"game_{id}");
            }
        }
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, $"{ids.Count} games deleted");
    }

    public async Task<ApiResponse<GameDto>> DuplicateAsync(string id)
    {
        var source = await _unitOfWork.Repository<Game>().GetByIdAsync(id);
        if (source == null || source.IsDeleted)
            return ApiResponse<GameDto>.NotFound("Game not found");

        var duplicate = new Game
        {
            Name = $"{source.Name} (Copy)",
            Slug = $"{source.Slug}-copy-{Guid.NewGuid().ToString()[..4]}",
            Description = source.Description,
            ShortDescription = source.ShortDescription,
            CategoryId = source.CategoryId,
            Platform = source.Platform,
            PublisherId = source.PublisherId,
            DeveloperId = source.DeveloperId,
            ReleaseDate = source.ReleaseDate,
            AgeRating = source.AgeRating,
            Languages = source.Languages,
            Genres = source.Genres,
            GameSize = source.GameSize,
            Version = source.Version,
            Status = GameStatus.Draft,
            IsFeatured = false,
            IsPopular = false,
            IsTrending = false,
            IsEditorsChoice = false
        };

        await _unitOfWork.Repository<Game>().AddAsync(duplicate);
        await _unitOfWork.SaveChangesAsync();
        var created = await _gameRepository.GetGameWithDetailsAsync(duplicate.Id);
        return ApiResponse<GameDto>.Created(_mapper.Map<GameDto>(created ?? duplicate), "Game duplicated");
    }

    public async Task<ApiResponse<bool>> ChangeStatusAsync(string id, string status)
    {
        var game = await _unitOfWork.Repository<Game>().GetByIdAsync(id);
        if (game == null || game.IsDeleted)
            return ApiResponse<bool>.NotFound("Game not found");

        if (Enum.TryParse<GameStatus>(status, true, out var gameStatus))
        {
            game.Status = gameStatus;
            _unitOfWork.Repository<Game>().Update(game);
            await _unitOfWork.SaveChangesAsync();
            await _cacheService.RemoveAsync($"game_{id}");
            return ApiResponse<bool>.Ok(true, $"Game status changed to {status}");
        }
        return ApiResponse<bool>.BadRequest("Invalid status");
    }

    public async Task<ApiResponse<List<GameListDto>>> GetFeaturedAsync()
    {
        var games = await _unitOfWork.Repository<Game>().FindAsync(g => g.IsFeatured && g.Status == GameStatus.Published && !g.IsDeleted);
        return ApiResponse<List<GameListDto>>.Ok(_mapper.Map<List<GameListDto>>(games.ToList()));
    }

    public async Task<ApiResponse<List<GameListDto>>> GetTrendingAsync()
    {
        var games = await _unitOfWork.Repository<Game>().FindAsync(g => g.IsTrending && g.Status == GameStatus.Published && !g.IsDeleted);
        return ApiResponse<List<GameListDto>>.Ok(_mapper.Map<List<GameListDto>>(games.ToList()));
    }

    public async Task<ApiResponse<List<GameListDto>>> GetLatestAsync(int count = 10)
    {
        var games = (await _unitOfWork.Repository<Game>().FindAsync(g => g.Status == GameStatus.Published && !g.IsDeleted))
            .OrderByDescending(g => g.CreatedAt).Take(count).ToList();
        return ApiResponse<List<GameListDto>>.Ok(_mapper.Map<List<GameListDto>>(games));
    }

    public async Task<ApiResponse<List<GameListDto>>> SearchAsync(string term)
    {
        var games = await _unitOfWork.Repository<Game>().FindAsync(g =>
            (g.Name.Contains(term) || g.ShortDescription.Contains(term) || g.Genres.Contains(term)) &&
            g.Status == GameStatus.Published && !g.IsDeleted);
        return ApiResponse<List<GameListDto>>.Ok(_mapper.Map<List<GameListDto>>(games.ToList()));
    }
}
