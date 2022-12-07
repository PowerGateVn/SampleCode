using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Application.Dto.Responses.Accounts;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities.Identity;
using System;
using System.Threading.Tasks;

namespace AgedCare.API.Services
{
    public interface IAccountService
    {
        Task<BaseResponse<string>> Register(RegisterRequest request);

        Task<BaseResponse<AuthenticationResponse>> Authenticate(AuthenticateRequest request, string ipAddress);

        Task<BaseResponse<bool>> VerifyEmail(string token, string userId);

        Task<BaseResponse<bool>> RevokeToken(string token, ApplicationUser currentUser, string ipAddress);

        Task<BaseResponse<AuthenticationResponse>> RefreshToken(string token, string ipAddress);

        Task<BaseResponse<bool>> ForgotPassword(ForgotPasswordRequest request);

        Task<BaseResponse<ValidateResetTokenResponse>> ValidateResetToken(ValidateResetTokenRequest request);

        Task<BaseResponse<string>> ResetPassword(ResetPasswordRequest request);

        Task<BaseResponse<AccountResponse>> GetById(Guid id);

        Task<BaseResponse<AccountResponse>> Create(CreateRequest request);
    }
}