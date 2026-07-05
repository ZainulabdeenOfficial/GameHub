using Microsoft.EntityFrameworkCore;
using GameHub.Domain.Entities;
using GameHub.Domain.Interfaces;
using GameHub.Persistence.Context;

namespace GameHub.Persistence.Repositories;

public class GameRepository : GenericRepository<Game>, IGameRepository
{
    public GameRepository(GameHubDbContext context) : base(context) { }

    public async Task<IEnumerable<Game>> GetFeaturedGamesAsync()
        => await _dbSet.Where(g => g.IsFeatured && g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted).ToListAsync();

    public async Task<IEnumerable<Game>> GetTrendingGamesAsync()
        => await _dbSet.Where(g => g.IsTrending && g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted).ToListAsync();

    public async Task<IEnumerable<Game>> GetPopularGamesAsync()
        => await _dbSet.Where(g => g.IsPopular && g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted).OrderByDescending(g => g.TotalDownloads).ToListAsync();

    public async Task<IEnumerable<Game>> GetLatestGamesAsync(int count)
        => await _dbSet.Where(g => g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted).OrderByDescending(g => g.CreatedAt).Take(count).ToListAsync();

    public async Task<IEnumerable<Game>> GetBestSellingGamesAsync(int count)
        => await _dbSet.Where(g => g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted).OrderByDescending(g => g.OrderItems.Count).Take(count).ToListAsync();

    public async Task<IEnumerable<Game>> GetUpcomingGamesAsync()
        => await _dbSet.Where(g => g.Status == Domain.Enums.GameStatus.Published && !g.IsDeleted && g.ReleaseDate > DateTime.UtcNow).OrderBy(g => g.ReleaseDate).ToListAsync();

    public async Task<IEnumerable<Game>> GetGamesByCategoryAsync(string categoryId)
        => await _dbSet.Where(g => g.CategoryId == categoryId && !g.IsDeleted).ToListAsync();

    public async Task<IEnumerable<Game>> SearchGamesAsync(string searchTerm)
    {
        var term = searchTerm.ToLower();
        return await _dbSet.Where(g => !g.IsDeleted && (g.Name.ToLower().Contains(term) || g.ShortDescription.ToLower().Contains(term) || g.Genres.ToLower().Contains(term))).ToListAsync();
    }

    public async Task<Game?> GetGameWithDetailsAsync(string gameId)
        => await _dbSet.AsNoTracking().Include(g => g.Images).Include(g => g.Screenshots).Include(g => g.GameFiles).Include(g => g.Category).Include(g => g.Publisher).Include(g => g.Developer).FirstOrDefaultAsync(g => g.Id == gameId && !g.IsDeleted);
}
