using GameHub.Domain.Common;

namespace GameHub.Domain.Entities;

public class HeroBanner : BaseEntity
{
    // === CORE CONTENT ===
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Badge { get; set; } // NEW, SALE, HOT, FEATURED
    public double? DiscountPercentage { get; set; }

    // === PRIMARY BUTTON ===
    public string? PrimaryButtonText { get; set; }
    public string? PrimaryButtonUrl { get; set; }

    // === SECONDARY BUTTON ===
    public string? SecondaryButtonText { get; set; }
    public string? SecondaryButtonUrl { get; set; }

    // === GAME LINK ===
    public string? GameId { get; set; }
    public Game? Game { get; set; }
    public string? GameName { get; set; }
    public string? CategoryName { get; set; }
    public string? PlatformName { get; set; }

    // === OVERLAY ===
    public double OverlayOpacity { get; set; } = 0.4;
    public string OverlayColor { get; set; } = "#000000";

    // === TEXT STYLING ===
    public string TextColor { get; set; } = "#ffffff";
    public string? FontFamily { get; set; }
    public string? FontSize { get; set; }
    public string? FontWeight { get; set; }

    // === BUTTON STYLING ===
    public string ButtonStyle { get; set; } = "rounded"; // rounded, square, glass, gradient, neon, glow, shadow, outline
    public string ButtonColor { get; set; } = "#6366f1";
    public string ButtonHoverColor { get; set; } = "#4f46e5";

    // === ALIGNMENT ===
    public string HorizontalAlignment { get; set; } = "center"; // left, center, right
    public string VerticalAlignment { get; set; } = "center"; // top, center, bottom

    // === BACKGROUND ===
    public string BackgroundType { get; set; } = "image"; // image, video, youtube, mp4, webm, solid, gradient, particle, none
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public string? Mp4Url { get; set; }
    public string? WebMUrl { get; set; }
    public string SolidColor { get; set; } = "#030712";
    public string? GradientStart { get; set; }
    public string? GradientEnd { get; set; }
    public string? GradientDirection { get; set; } // to-r, to-b, to-tr, to-bl

    // === ANIMATED / 3D BACKGROUND ===
    public bool AnimatedBackground { get; set; }
    public string? LottieUrl { get; set; }
    public bool ThreeJsEnabled { get; set; }
    public bool ParticleEnabled { get; set; }
    public string? ParticleType { get; set; } // stars, smoke, fire, rain, snow, cyberGrid, glowingLines
    public string? BackgroundLayers { get; set; } // JSON array of layer configs

    // === 3D EFFECTS ===
    public bool FloatingObjects { get; set; }
    public bool FloatingControllers { get; set; }
    public bool FloatingCds { get; set; }
    public bool FloatingCubes { get; set; }

    // === TEXT ANIMATION ===
    public string TextAnimation { get; set; } = "fade"; // fade, slide, zoom, bounce, rotate, flip, typing, glow, gsap

    // === CAROUSEL SETTINGS ===
    public bool AutoplayEnabled { get; set; } = true;
    public bool InfiniteLoopEnabled { get; set; } = true;
    public int CarouselTransitionSpeed { get; set; } = 500; // ms
    public string CarouselAnimationType { get; set; } = "slide"; // slide, fade, zoom
    public bool PauseOnHover { get; set; } = true;

    // === ORDERING & STATUS ===
    public int SortOrder { get; set; }
    public int Priority { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsArchived { get; set; }

    // === SCHEDULING ===
    public DateTime? PublishStartDate { get; set; }
    public DateTime? PublishEndDate { get; set; }

    // === CUSTOMIZATION PANEL ===
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
    public string? BgColor { get; set; }
    public string? HeroHeight { get; set; } // e.g., "600px", "100vh"
    public string? HeroWidth { get; set; } // e.g., "100%"
    public string? CssBorderRadius { get; set; }
    public string? CssShadow { get; set; }
    public string? CssSpacing { get; set; }
    public string? CssPadding { get; set; }
    public string? CssMargins { get; set; }
    public int AnimationDuration { get; set; } = 300; // ms
    public int TransitionSpeed { get; set; } = 300; // ms

    // === RESPONSIVE ===
    public string? DesktopSettings { get; set; } // JSON
    public string? TabletSettings { get; set; } // JSON
    public string? MobileSettings { get; set; } // JSON
}
