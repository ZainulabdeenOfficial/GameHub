using GameHub.Domain.Entities;

namespace GameHub.Domain.Interfaces;

public interface IGameRepository : IGenericRepository<Game>
{
    Task<IEnumerable<Game>> GetFeaturedGamesAsync();
    Task<IEnumerable<Game>> GetTrendingGamesAsync();
    Task<IEnumerable<Game>> GetPopularGamesAsync();
    Task<IEnumerable<Game>> GetLatestGamesAsync(int count);
    Task<IEnumerable<Game>> GetBestSellingGamesAsync(int count);
    Task<IEnumerable<Game>> GetUpcomingGamesAsync();
    Task<IEnumerable<Game>> GetGamesByCategoryAsync(string categoryId);
    Task<IEnumerable<Game>> SearchGamesAsync(string searchTerm);
    Task<Game?> GetGameWithDetailsAsync(string gameId);
}
