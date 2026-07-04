using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class Publisher : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string? Country { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Game> Games { get; set; } = new List<Game>();
}
