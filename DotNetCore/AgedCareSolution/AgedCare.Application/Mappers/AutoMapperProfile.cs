using AgedCare.Application.Dto.Requests.HealthHistory;
using AgedCare.Application.Dto.Responses.Accounts;
using AgedCare.Domain.Entities;
using AgedCare.Domain.Entities.Identity;
using AutoMapper;

namespace AgedCare.Application.Mappers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, AccountResponse>();

            CreateMap<ApplicationUser, AuthenticationResponse>();

            CreateMap<HealthHistoryDto, HealthHistory>();

            CreateMap<HealthHistory, HealthHistoryGetDto>();
        }
    }
}