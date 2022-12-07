using AgedCare.Domain.Entities.Identity;

namespace AgedCare.Application.Dto.Responses.Accounts
{
    public class GetRefreshTokenResponse
    {
        public bool IsSuccess { get; set; }

        public string Message { get; set; }

        public ApplicationUser ApplicationUser { get; set; }

        public RefreshToken RefreshToken { get; set; }
    }
}