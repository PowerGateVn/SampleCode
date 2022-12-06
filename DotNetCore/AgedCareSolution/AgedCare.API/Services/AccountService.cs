using AgedCare.API.Helpers;
using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Application.Exceptions;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Enums;
using AgedCare.Domain.Settings;
using AgedCare.Infrastructure.Contexts;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AgedCare.Application.Dto.Responses.Accounts;

namespace AgedCare.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JWTSettings _jwt;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public AccountService(UserManager<ApplicationUser> userManager, IOptions<JWTSettings> jwt, ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _jwt = jwt.Value;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<BaseResponse<AuthenticationResponse>> Authenticate(AuthenticateRequest request, string ipAddress)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                {
                    return new ResponseFail<AuthenticationResponse>((int)HttpStatusCode.NotFound, AppConstant.ACCOUNT_NOT_FOUND);
                }

                var isCorrectPassword = await _userManager.CheckPasswordAsync(user, request.Password);

                if (!isCorrectPassword)
                {
                    return new ResponseFail<AuthenticationResponse>((int)HttpStatusCode.BadRequest, AppConstant.INVALID_PASSWORD);
                }

                //Email confirm or not
                if (!user.IsVerified)
                {
                    return new ResponseFail<AuthenticationResponse>((int)HttpStatusCode.BadRequest, AppConstant.EMAIL_NOT_CONFIRMED_YET);
                }

                //Authentication successful so generate jwt and refresh tokens
                JwtSecurityToken jwtSecurityToken = await CreateJwtToken(user);
                var refreshToken = GenerateRefreshToken(ipAddress);
                user.RefreshTokens.Add(refreshToken);

                //Remove old refresh tokens from account
                RemoveOldRefreshTokens(user);

                _context.Update(user);
                await _context.SaveChangesAsync();

                var rolesList = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
                user.Roles = rolesList.ToList();

                var response = _mapper.Map<AuthenticationResponse>(user);
                response.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
                response.RefreshToken = refreshToken.Token;

                return new ResponseSuccess<AuthenticationResponse>((int)HttpStatusCode.OK, AppConstant.SUCCESS, response);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("Authenticate", request, e.Message, e);
            }
        }

        private async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();

            foreach (var role in roles)
            {
                roleClaims.Add(new Claim("roles", role));
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id.ToString())
            }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.DurationInMinutes),
                signingCredentials: signingCredentials);

            return jwtSecurityToken;
        }

        public async Task<BaseResponse<string>> Register(RegisterRequest request)
        {
            try
            {
                var userWithSameEmail = await _userManager.FindByEmailAsync(request.Email);
                if (userWithSameEmail != null)
                {
                    string msgError = AppConstant.EMAIL_IS_ALREADY_TAKEN;

                    return new ResponseFail<string>((int)HttpStatusCode.BadRequest, msgError, new List<string> { msgError });
                }

                var user = new ApplicationUser
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    UserName = request.Email
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, Roles.User.ToString());

                    user.VerificationToken = RandomTokenString();

                    await _context.SaveChangesAsync();

                    var confirmLink = HttpContextHelper.GenerateConfirmLink(_httpContextAccessor, user.VerificationToken, user.Id.ToString());
                    SendVerificationEmail(user, confirmLink, user.VerificationToken);

                    return new ResponseSuccess<string>(AppConstant.SUCCESS);
                }

                return new ResponseFail<string>((int)HttpStatusCode.InternalServerError, AppConstant.THERE_IS_SOME_THING_WENT_WRONG);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("Register", request, e.Message, e);
            }
        }

        public async Task<BaseResponse<bool>> VerifyEmail(string token, string userId)
        {
            try
            {
                if (userId == null || token == null)
                {
                    return new ResponseFail<bool>((int)HttpStatusCode.BadRequest, AppConstant.CONFIRM_FAIL);
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new ResponseFail<bool>((int)HttpStatusCode.BadRequest, AppConstant.ACCOUNT_NOT_FOUND);
                }

                if (user.VerificationToken == token)
                {
                    user.Verified = DateTime.UtcNow;
                    user.VerificationToken = null;

                    await _context.SaveChangesAsync();

                    return new ResponseSuccess<bool>((int)HttpStatusCode.OK, AppConstant.CONFIRM_SUCCESSFULLY);
                }

                return new ResponseFail<bool>((int)HttpStatusCode.BadRequest, AppConstant.INVALID_TOKEN);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("VerifyEmail", new { Token = token, userId = userId }, e.Message, e);
            }
        }

        public async Task<BaseResponse<bool>> RevokeToken(string token, ApplicationUser currentUser, string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(token)) return new ResponseFail<bool>((int)HttpStatusCode.BadRequest, AppConstant.REVOKE_TOKEN_FAIL);

                // users can revoke their own tokens and admins can revoke any tokens
                var listRoles = await _userManager.GetRolesAsync(currentUser);

                var listAllTokenOfUser = _context.RefreshTokens
                    .Where(x => x.UserId == currentUser.Id)
                    .Select(x => x.Token).ToList();

                if (!listAllTokenOfUser.Contains(token) && !listRoles.ToList().Contains(Roles.Admin.ToString()))
                {
                    return new ResponseFail<bool>((int)HttpStatusCode.Unauthorized, AppConstant.UNAUTHORIZED);
                }

                var response = await GetRefreshToken(token);

                if (!response.IsSuccess)
                {
                    return new ResponseFail<bool>((int)HttpStatusCode.BadRequest, response.Message);
                }

                response.RefreshToken.Revoked = DateTime.UtcNow;
                response.RefreshToken.RevokedByIp = ipAddress;

                _context.Update(response.ApplicationUser);
                await _context.SaveChangesAsync();

                return new ResponseSuccess<bool>((int)HttpStatusCode.OK, AppConstant.REVOKE_TOKEN_SUCCESS);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("RevokeToken",
                    new { Token = token, ApplicationUser = currentUser, IpAddress = ipAddress },
                    e.Message,
                    e);
            }
        }

        public async Task<BaseResponse<AuthenticationResponse>> RefreshToken(string token, string ipAddress)
        {
            try
            {
                var getRefreshTokenResponse = await GetRefreshToken(token);

                if (!getRefreshTokenResponse.IsSuccess)
                {
                    return new ResponseFail<AuthenticationResponse>((int)HttpStatusCode.BadRequest, getRefreshTokenResponse.Message);
                }

                var newRefreshToken = GenerateRefreshToken(ipAddress);

                getRefreshTokenResponse.RefreshToken.Revoked = DateTime.UtcNow;
                getRefreshTokenResponse.RefreshToken.RevokedByIp = ipAddress;
                getRefreshTokenResponse.RefreshToken.ReplacedByToken = newRefreshToken.Token;
                getRefreshTokenResponse.ApplicationUser.RefreshTokens.Add(newRefreshToken);

                RemoveOldRefreshTokens(getRefreshTokenResponse.ApplicationUser);

                _context.Update(getRefreshTokenResponse.ApplicationUser);
                await _context.SaveChangesAsync();

                // generate new jwt
                JwtSecurityToken jwtSecurityToken = await CreateJwtToken(getRefreshTokenResponse.ApplicationUser);

                var rolesList = await _userManager.GetRolesAsync(getRefreshTokenResponse.ApplicationUser).ConfigureAwait(false);

                getRefreshTokenResponse.ApplicationUser.Roles = rolesList.ToList();

                var response = _mapper.Map<AuthenticationResponse>(getRefreshTokenResponse.ApplicationUser);
                response.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
                response.RefreshToken = newRefreshToken.Token;

                return new ResponseSuccess<AuthenticationResponse>(
                    (int)HttpStatusCode.OK,
                    $"Refresh token successfully for {getRefreshTokenResponse.ApplicationUser.Email}",
                    response);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("RefreshToken", new { Token = token, IpAddress = ipAddress }, e.Message, e);
            }
        }

        public async Task<BaseResponse<bool>> ForgotPassword(ForgotPasswordRequest request)
        {
            try
            {
                var account = await _userManager.FindByEmailAsync(request.Email);

                if (account == null)
                {
                    return new ResponseFail<bool>((int)HttpStatusCode.NotFound, AppConstant.ACCOUNT_NOT_FOUND);
                }

                account.ResetToken = StringHelper.RandomString(10);
                account.ResetTokenExpires = DateTime.UtcNow.AddDays(AppConstant.RESET_TOKEN_EXPIRED_IN_DAY);

                _context.Update(account);
                await _context.SaveChangesAsync();

                //Send email
                SendResetPasswordEmail(account, account.ResetToken);

                return new ResponseSuccess<bool>($"Please check your email {request.Email} for password reset instructions");
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("ForgotPassword", request, e.Message, e);
            }
        }

        public async Task<BaseResponse<ValidateResetTokenResponse>> ValidateResetToken(ValidateResetTokenRequest request)
        {
            try
            {
                var resultCheck = await CheckResetTokenIsValidOrNot(request.Email, request.Token);
                string newToken = StringHelper.RandomString(10);

                if (resultCheck.IsSuccess)
                {
                    resultCheck.Data.ResetToken = newToken;
                    resultCheck.Data.IsValidateResetToken = true;

                    await _context.SaveChangesAsync();
                }

                return new BaseResponse<ValidateResetTokenResponse>
                {
                    StatusCode = resultCheck.StatusCode,
                    IsSuccess = resultCheck.IsSuccess,
                    Message = resultCheck.Message,
                    Data = resultCheck.IsSuccess ? new ValidateResetTokenResponse { Token = newToken } : null
                };
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("ValidateResetToken", request, e.Message, e);
            }
        }

        public async Task<BaseResponse<string>> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                var resultCheck = await CheckResetTokenIsValidOrNot(request.Email, request.Token);

                if (!resultCheck.IsSuccess)
                {
                    return new ResponseFail<string>(resultCheck.Message);
                }

                var account = await _userManager.FindByEmailAsync(request.Email);

                if (!account.IsValidateResetToken.GetValueOrDefault())
                {
                    return new ResponseFail<string>(AppConstant.INVALID_TOKEN);
                }

                await _userManager.RemovePasswordAsync(resultCheck.Data);

                var resultChangePassword = await _userManager.AddPasswordAsync(resultCheck.Data, request.Password);

                if (resultChangePassword.Succeeded)
                {
                    resultCheck.Data.PasswordReset = DateTime.UtcNow;
                    resultCheck.Data.ResetToken = null;
                    resultCheck.Data.ResetTokenExpires = null;
                    resultCheck.Data.IsValidateResetToken = false;

                    _context.Update(resultCheck.Data);
                    await _context.SaveChangesAsync();

                    return new ResponseSuccess<string>(AppConstant.CHANGE_PASSWORD_SUCCESSFULLY);
                }

                return new ResponseFail<string>(AppConstant.THERE_IS_SOME_THING_WENT_WRONG);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("ResetPassword", request, e.Message, e);
            }
        }

        public async Task<BaseResponse<AccountResponse>> GetById(Guid id)
        {
            try
            {
                var account = await GetAccountById(id);

                if (account == null)
                {
                    return new ResponseFail<AccountResponse>((int)HttpStatusCode.NotFound, AppConstant.ACCOUNT_NOT_FOUND);
                }

                var listRoles = await _userManager.GetRolesAsync(account);
                account.Roles = listRoles.ToList();

                var response = _mapper.Map<AccountResponse>(account);

                return new ResponseSuccess<AccountResponse>((int)HttpStatusCode.OK, AppConstant.SUCCESS, response);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("GetById", id, e.Message, e);
            }
        }

        public async Task<BaseResponse<AccountResponse>> Create(CreateRequest request)
        {
            try
            {
                var userWithSameEmail = await _userManager.FindByEmailAsync(request.Email);

                if (userWithSameEmail != null)
                {
                    string msgError = AppConstant.EMAIL_IS_ALREADY_TAKEN;
                    return new ResponseFail<AccountResponse>((int)HttpStatusCode.BadRequest, msgError, new List<string> { msgError });
                }

                var user = new ApplicationUser
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    UserName = request.Email
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    foreach (var role in request.Roles)
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }

                    user.VerificationToken = RandomTokenString();

                    await _context.SaveChangesAsync();

                    var confirmLink = HttpContextHelper.GenerateConfirmLink(_httpContextAccessor, user.VerificationToken, user.Id.ToString());
                    SendVerificationEmail(user, confirmLink, user.VerificationToken);

                    return new ResponseSuccess<AccountResponse>(AppConstant.SUCCESS);
                }

                return new ResponseFail<AccountResponse>(AppConstant.THERE_IS_SOME_THING_WENT_WRONG);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("GetById", request, e.Message, e);
            }
        }

        #region Helper Methods

        private async Task<ApplicationUser> GetAccountById(Guid id)
        {
            try
            {
                return await _userManager
                    .Users
                    .FirstOrDefaultAsync(x => x.Id == id);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("GetAccountById", id, e.Message, e);
            }
        }

        private async Task<BaseResponse<ApplicationUser>> CheckResetTokenIsValidOrNot(string email, string resetToken)
        {
            try
            {
                var account = await _userManager
                    .Users
                    .SingleOrDefaultAsync(x => x.Email == email && x.ResetToken == resetToken && x.ResetTokenExpires > DateTime.UtcNow);

                if (account == null)
                {
                    return new ResponseFail<ApplicationUser>
                    {
                        StatusCode = (int)HttpStatusCode.BadRequest,
                        IsSuccess = false,
                        Message = AppConstant.INVALID_TOKEN
                    };
                }

                return new ResponseSuccess<ApplicationUser>
                {
                    StatusCode = (int)HttpStatusCode.OK,
                    IsSuccess = true,
                    Message = AppConstant.SUCCESS,
                    Data = account
                };
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("CheckResetTokenIsValidOrNot", new { Email = email, ResetToken = resetToken }, e.Message, e);
            }
        }

        private void SendResetPasswordEmail(ApplicationUser account, string resetToken)
        {
            try
            {
                var message = $@"
                             <p>The code will be valid for {AppConstant.RESET_TOKEN_EXPIRED_IN_DAY} day.</p>
                             <p>Please use the code: <b>{resetToken}</b> to validation.</p>";

                _emailService.Send(account.Email, "Reset Password", $@"<h4>Reset Password Email</h4>{message}");
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("SendResetPasswordEmail",
                    new { ApplicationUser = account, ResetToken = resetToken }, e.Message, e);
            }
        }

        private void SendVerificationEmail(ApplicationUser applicationUser, string confirmLink, string code)
        {
            try
            {
                var message = !string.IsNullOrEmpty(confirmLink) ? $@"
                             <p>Please click the below link to verify your email address:</p>
                             <p><a href=""{confirmLink}"">{confirmLink}</a></p>" : $@"
                             <p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{code}</code></p>";

                _emailService.Send(applicationUser.Email, "Sign-up Verification API - Verify Email",
                    $@"<h4>Verify Email</h4><p>Thanks for registering!</p>{message}");
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("SendVerificationEmail",
                    new { ApplicationUser = applicationUser, ConfirmLink = confirmLink, Code = code }, e.Message, e);
            }
        }

        private async Task<GetRefreshTokenResponse> GetRefreshToken(string token)
        {
            try
            {
                var refreshTokenInDb = await _context.RefreshTokens
                    .Include(x => x.ApplicationUser)
                    .FirstOrDefaultAsync(x => x.Token == token);

                if (refreshTokenInDb == null || !refreshTokenInDb.IsActive)
                {
                    return new GetRefreshTokenResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid Token"
                    };
                }

                var account = refreshTokenInDb.ApplicationUser;

                if (account == null)
                {
                    return new GetRefreshTokenResponse
                    {
                        IsSuccess = false,
                        Message = "Unknown user"
                    };
                }

                return new GetRefreshTokenResponse
                {
                    IsSuccess = true,
                    ApplicationUser = account,
                    RefreshToken = refreshTokenInDb
                };
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("GetRefreshToken", token, e.Message, e);
            }
        }

        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(AppConstant.REFRESH_TOKEN_EXPIRED_IN_DAY),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        private void RemoveOldRefreshTokens(ApplicationUser user)
        {
            try
            {
                user.RefreshTokens.RemoveAll(x =>
                    !x.IsActive && x.Created.AddDays(AppConstant.REFRESH_TOKEN_EXPIRED_IN_DAY) <= DateTime.UtcNow);
            }
            catch (Exception e)
            {
                throw new ExceptionCustom("RemoveOldRefreshTokens", user, e.Message, e);
            }
        }

        private string RandomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);

            return BitConverter.ToString(randomBytes).Replace("-", "");
        }
        #endregion
    }
}