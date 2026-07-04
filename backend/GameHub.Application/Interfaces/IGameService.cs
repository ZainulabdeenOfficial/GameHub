using GameHub.Application.DTOs.Common;
using GameHub.Application.DTOs.Game;

namespace GameHub.Application.Interfaces;

public interface IGameService
{
    Task<ApiResponse<GameDto>> GetByIdAsync(string id);
    Task<ApiResponse<PagedResponse<List<GameListDto>>>> GetAllAsync(GameFilterRequest filter);
    Task<ApiResponse<GameDto>> CreateAsync(CreateGameRequest request);
    Task<ApiResponse<GameDto>> UpdateAsync(string id, UpdateGameRequest request);
    Task<ApiResponse<bool>> DeleteAsync(string id);
    Task<ApiResponse<bool>> BulkDeleteAsync(List<string> ids);
    Task<ApiResponse<GameDto>> DuplicateAsync(string id);
    Task<ApiResponse<bool>> ChangeStatusAsync(string id, string status);
    Task<ApiResponse<List<GameListDto>>> GetFeaturedAsync();
    Task<ApiResponse<List<GameListDto>>> GetTrendingAsync();
    Task<ApiResponse<List<GameListDto>>> GetLatestAsync(int count = 10);
    Task<ApiResponse<List<GameListDto>>> SearchAsync(string term);
}
