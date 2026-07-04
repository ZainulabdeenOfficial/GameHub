using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using GameHub.Domain.Entities;
using GameHub.Domain.Enums;
using GameHub.Persistence.Context;

namespace GameHub.Persistence.Seeds;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GameHubDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.EnsureCreatedAsync();

        string[] roles = { "SuperAdmin", "Admin", "Moderator", "Customer" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        if (!context.Users.Any())
        {
            var admin = new User
            {
                UserName = "admin@gamehub.com",
                Email = "admin@gamehub.com",
                FullName = "Super Admin",
                EmailConfirmed = true,
                IsActive = true,
                Role = UserRole.SuperAdmin
            };
            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, "SuperAdmin");
        }

        if (!context.Publishers.Any())
        {
            context.Publishers.AddRange(
                new Publisher { Name = "Electronic Arts", Slug = "electronic-arts", IsActive = true },
                new Publisher { Name = "Ubisoft", Slug = "ubisoft", IsActive = true },
                new Publisher { Name = "Activision Blizzard", Slug = "activision-blizzard", IsActive = true }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Developers.Any())
        {
            context.Developers.AddRange(
                new Developer { Name = "DICE", Slug = "dice", IsActive = true },
                new Developer { Name = "Ubisoft Montreal", Slug = "ubisoft-montreal", IsActive = true },
                new Developer { Name = "Infinity Ward", Slug = "infinity-ward", IsActive = true }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "Action", Slug = "action", Description = "Action games", IsActive = true, DisplayOrder = 1 },
                new Category { Name = "Adventure", Slug = "adventure", Description = "Adventure games", IsActive = true, DisplayOrder = 2 },
                new Category { Name = "RPG", Slug = "rpg", Description = "Role playing games", IsActive = true, DisplayOrder = 3 },
                new Category { Name = "Strategy", Slug = "strategy", Description = "Strategy games", IsActive = true, DisplayOrder = 4 },
                new Category { Name = "Sports", Slug = "sports", Description = "Sports games", IsActive = true, DisplayOrder = 5 },
                new Category { Name = "Racing", Slug = "racing", Description = "Racing games", IsActive = true, DisplayOrder = 6 }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Games.Any())
        {
            var categories = context.Categories.ToList();
            var publishers = context.Publishers.ToList();
            var developers = context.Developers.ToList();
            if (categories.Any() && publishers.Any() && developers.Any())
            {
                var random = new Random();
                var games = new List<Game>
                {
                    new() { Name = "Battlefield 2042", Slug = "battlefield-2042", Description = "A first-person shooter video game.", ShortDescription = "Epic battlefield action", CategoryId = categories[0].Id, Platform = Platform.Windows, PublisherId = publishers[0].Id, DeveloperId = developers[0].Id, ReleaseDate = new DateTime(2024, 10, 22), AgeRating = AgeRating.M, Languages = "English,French,German", Genres = "FPS,Action", GameSize = 45.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = true, IsTrending = true, IsEditorsChoice = true, AverageRating = 4.5, TotalDownloads = 125000, TotalViews = 500000, TotalReviews = 2500 },
                    new() { Name = "Assassin's Creed Mirage", Slug = "assassins-creed-mirage", Description = "An action-adventure game set in Baghdad.", ShortDescription = "Become a master assassin", CategoryId = categories[1].Id, Platform = Platform.Windows, PublisherId = publishers[1].Id, DeveloperId = developers[1].Id, ReleaseDate = new DateTime(2024, 10, 5), AgeRating = AgeRating.M, Languages = "English,French,Spanish", Genres = "Action,Adventure,Stealth", GameSize = 55.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = true, IsTrending = true, AverageRating = 4.3, TotalDownloads = 98000, TotalViews = 420000, TotalReviews = 1800 },
                    new() { Name = "Call of Duty: Modern Warfare III", Slug = "cod-modern-warfare-3", Description = "The latest installment in the Call of Duty series.", ShortDescription = "The ultimate COD experience", CategoryId = categories[0].Id, Platform = Platform.Windows, PublisherId = publishers[2].Id, DeveloperId = developers[2].Id, ReleaseDate = new DateTime(2024, 11, 10), AgeRating = AgeRating.M, Languages = "English,French,German,Spanish", Genres = "FPS,Action,Multiplayer", GameSize = 85.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = true, IsTrending = false, AverageRating = 4.1, TotalDownloads = 200000, TotalViews = 800000, TotalReviews = 5000 },
                    new() { Name = "Starfield", Slug = "starfield", Description = "An epic space exploration RPG.", ShortDescription = "Explore the stars", CategoryId = categories[2].Id, Platform = Platform.Windows, PublisherId = publishers[0].Id, DeveloperId = developers[0].Id, ReleaseDate = new DateTime(2024, 9, 6), AgeRating = AgeRating.M, Languages = "English,French,German,Japanese", Genres = "RPG,Space,OpenWorld", GameSize = 125.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = true, IsTrending = true, AverageRating = 4.6, TotalDownloads = 150000, TotalViews = 650000, TotalReviews = 3200 },
                    new() { Name = "FIFA 25", Slug = "fifa-25", Description = "The world's most popular football game.", ShortDescription = "Play the beautiful game", CategoryId = categories[4].Id, Platform = Platform.Windows, PublisherId = publishers[0].Id, DeveloperId = developers[0].Id, ReleaseDate = new DateTime(2024, 9, 27), AgeRating = AgeRating.E, Languages = "English,French,German,Spanish,Italian,Portuguese", Genres = "Sports,Football,Multiplayer", GameSize = 50.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = true, IsTrending = false, AverageRating = 4.0, TotalDownloads = 300000, TotalViews = 1000000, TotalReviews = 8000 },
                    new() { Name = "Forza Horizon 6", Slug = "forza-horizon-6", Description = "The ultimate racing game experience.", ShortDescription = "Feel the speed", CategoryId = categories[5].Id, Platform = Platform.Windows, PublisherId = publishers[0].Id, DeveloperId = developers[0].Id, ReleaseDate = new DateTime(2024, 11, 9), AgeRating = AgeRating.E, Languages = "English,French,German", Genres = "Racing,OpenWorld", GameSize = 65.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = true, IsPopular = false, IsTrending = true, AverageRating = 4.7, TotalDownloads = 180000, TotalViews = 700000, TotalReviews = 4500 },
                    new() { Name = "Rainbow Six Siege", Slug = "rainbow-six-siege", Description = "A tactical shooter game.", ShortDescription = "Master the art of CQB", CategoryId = categories[0].Id, Platform = Platform.Windows, PublisherId = publishers[1].Id, DeveloperId = developers[1].Id, ReleaseDate = new DateTime(2024, 12, 1), AgeRating = AgeRating.M, Languages = "English,French,German,Spanish", Genres = "FPS,Tactical,Multiplayer", GameSize = 40.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = false, IsPopular = true, IsTrending = false, AverageRating = 4.2, TotalDownloads = 250000, TotalViews = 900000, TotalReviews = 6000 },
                    new() { Name = "The Witcher 4", Slug = "the-witcher-4", Description = "A dark fantasy RPG.", ShortDescription = "A new saga begins", CategoryId = categories[2].Id, Platform = Platform.Windows, PublisherId = publishers[0].Id, DeveloperId = developers[0].Id, ReleaseDate = new DateTime(2024, 12, 15), AgeRating = AgeRating.M, Languages = "English,French,German,Polish", Genres = "RPG,Fantasy,OpenWorld", GameSize = 90.0, Version = "1.0", Status = GameStatus.Published, IsFeatured = false, IsPopular = true, IsTrending = true, AverageRating = 4.8, TotalDownloads = 90000, TotalViews = 350000, TotalReviews = 1500 },
                };
                context.Games.AddRange(games);
            }
        }

        await context.SaveChangesAsync();
    }
}
