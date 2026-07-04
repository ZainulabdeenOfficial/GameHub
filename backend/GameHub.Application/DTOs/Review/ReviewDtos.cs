namespace GameHub.Application.DTOs.Review;

public record ReviewDto(
    string Id, string GameId, string UserId, string UserName, string? UserProfilePicture,
    int Rating, string Comment, DateTime CreatedAt, int Likes
);

public record CreateReviewRequest(string GameId, int Rating, string Comment);

public record ReviewListDto(
    string Id, string UserId, string UserName, string? UserProfilePicture,
    int Rating, string Comment, DateTime CreatedAt, int Likes
);
