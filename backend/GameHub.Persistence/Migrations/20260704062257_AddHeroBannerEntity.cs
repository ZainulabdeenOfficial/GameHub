using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameHub.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroBannerEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HeroBanners",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Badge = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiscountPercentage = table.Column<double>(type: "float", nullable: true),
                    PrimaryButtonText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrimaryButtonUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondaryButtonText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondaryButtonUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GameId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GameName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OverlayOpacity = table.Column<double>(type: "float", nullable: false),
                    OverlayColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TextColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FontFamily = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FontSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FontWeight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ButtonStyle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ButtonColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ButtonHoverColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HorizontalAlignment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VerticalAlignment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BackgroundType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    YoutubeUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mp4Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WebMUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SolidColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GradientStart = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GradientEnd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GradientDirection = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnimatedBackground = table.Column<bool>(type: "bit", nullable: false),
                    LottieUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThreeJsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    ParticleEnabled = table.Column<bool>(type: "bit", nullable: false),
                    ParticleType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BackgroundLayers = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FloatingObjects = table.Column<bool>(type: "bit", nullable: false),
                    FloatingControllers = table.Column<bool>(type: "bit", nullable: false),
                    FloatingCds = table.Column<bool>(type: "bit", nullable: false),
                    FloatingCubes = table.Column<bool>(type: "bit", nullable: false),
                    TextAnimation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AutoplayEnabled = table.Column<bool>(type: "bit", nullable: false),
                    InfiniteLoopEnabled = table.Column<bool>(type: "bit", nullable: false),
                    CarouselTransitionSpeed = table.Column<int>(type: "int", nullable: false),
                    CarouselAnimationType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PauseOnHover = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false),
                    PublishStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PublishEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PrimaryColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondaryColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccentColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BgColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroHeight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroWidth = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CssBorderRadius = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CssShadow = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CssSpacing = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CssPadding = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CssMargins = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnimationDuration = table.Column<int>(type: "int", nullable: false),
                    TransitionSpeed = table.Column<int>(type: "int", nullable: false),
                    DesktopSettings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TabletSettings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileSettings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroBanners", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HeroBanners_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HeroBanners_GameId",
                table: "HeroBanners",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroBanners_IsFeatured",
                table: "HeroBanners",
                column: "IsFeatured");

            migrationBuilder.CreateIndex(
                name: "IX_HeroBanners_IsPublished",
                table: "HeroBanners",
                column: "IsPublished");

            migrationBuilder.CreateIndex(
                name: "IX_HeroBanners_SortOrder",
                table: "HeroBanners",
                column: "SortOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeroBanners");
        }
    }
}
