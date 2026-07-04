using AutoMapper;
using GameHub.Application.DTOs.Banner;
using GameHub.Application.DTOs.Game;
using GameHub.Application.DTOs.Order;
using GameHub.Domain.Entities;

namespace GameHub.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Game, GameDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.PublisherName, o => o.MapFrom(s => s.Publisher != null ? s.Publisher.Name : null))
            .ForMember(d => d.DeveloperName, o => o.MapFrom(s => s.Developer != null ? s.Developer.Name : null));
        CreateMap<Game, GameListDto>();
        CreateMap<GameImage, GameImageDto>();
        CreateMap<Screenshot, ScreenshotDto>();
        CreateMap<Order, OrderDto>()
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.FullName));
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.GameName, o => o.MapFrom(s => s.Game.Name))
            .ForMember(d => d.ThumbnailUrl, o => o.MapFrom(s => s.Game.ThumbnailUrl));
    }
}
