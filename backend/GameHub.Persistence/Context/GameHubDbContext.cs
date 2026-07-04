using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GameHub.Domain.Entities;
using GameHub.Domain.Common;

namespace GameHub.Persistence.Context;

public class GameHubDbContext : IdentityDbContext<User>
{
    public GameHubDbContext(DbContextOptions<GameHubDbContext> options) : base(options) { }

    public DbSet<Game> Games => Set<Game>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<GameImage> GameImages => Set<GameImage>();
    public DbSet<Screenshot> Screenshots => Set<Screenshot>();
    public DbSet<GameFile> GameFiles => Set<GameFile>();
    public DbSet<Publisher> Publishers => Set<Publisher>();
    public DbSet<Developer> Developers => Set<Developer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Download> Downloads => Set<Download>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<HeroBanner> HeroBanners => Set<HeroBanner>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetPrecision(18);
                    property.SetScale(2);
                }
            }
        }

        builder.Entity<Game>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(e => e.Category).WithMany(c => c.Games).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.Publisher).WithMany(p => p.Games).HasForeignKey(e => e.PublisherId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.Developer).WithMany(d => d.Games).HasForeignKey(e => e.DeveloperId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Category>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(e => e.ParentCategory).WithMany(c => c.SubCategories).HasForeignKey(e => e.ParentCategoryId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<GameImage>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany(g => g.Images).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Screenshot>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany(g => g.Screenshots).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<GameFile>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany(g => g.GameFiles).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasOne(e => e.User).WithMany(u => u.Orders).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<OrderItem>(entity =>
        {
            entity.HasOne(e => e.Order).WithMany(o => o.OrderItems).HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Game).WithMany(g => g.OrderItems).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Payment>(entity =>
        {
            entity.HasOne(e => e.Order).WithMany(o => o.Payments).HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Review>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany(g => g.Reviews).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany(u => u.Reviews).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.GameId, e.UserId }).IsUnique();
        });

        builder.Entity<WishlistItem>(entity =>
        {
            entity.HasOne(e => e.User).WithMany(u => u.WishlistItems).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Game).WithMany(g => g.WishlistItems).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
        });

        builder.Entity<CartItem>(entity =>
        {
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Notification>(entity =>
        {
            entity.HasOne(e => e.User).WithMany(u => u.Notifications).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Download>(entity =>
        {
            entity.HasOne(e => e.User).WithMany(u => u.Downloads).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Coupon>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
        });

        builder.Entity<Banner>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<HeroBanner>(entity =>
        {
            entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(e => e.SortOrder);
            entity.HasIndex(e => e.IsPublished);
            entity.HasIndex(e => e.IsFeatured);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Deleted:
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = DateTime.UtcNow;
                    entry.State = EntityState.Modified;
                    break;
            }
        }
        return await base.SaveChangesAsync(cancellationToken);
    }
}
