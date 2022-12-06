using AgedCare.API.Services;
using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;

namespace AgedCare.API.Controllers
{
    [Route("api/[controller]")]
    public class AccountsController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountsController(UserManager<ApplicationUser> userManager, IAccountService accountService)
            : base(userManager)
        {
            _accountService = accountService;
        }

        /// <summary>
        /// User register new account. After register, newly registered users will automatically be sent an email containing an email verification link
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "FirstName": "John",
        ///        "LastName": "Smith",
        ///        "Email": "test_email@gmail.com",
        ///        "Password": "Password@123"
        ///     }
        ///
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Successfully.",
        ///        "Errors": null,
        ///        "Data": null
        ///     }
        ///
        /// </remarks>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterAsync([FromBody] RegisterRequest model)
        {
            var result = await _accountService.Register(model);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// After register, user must verify email. After verify email, user can login
        /// </summary>
        [AllowAnonymous]
        [HttpGet("verify-email")]
        public async Task VerifyEmail(string token, string userId)
        {
            var result = await _accountService.VerifyEmail(token, userId);

            if (result.IsSuccess)
                HttpContext.Response.Redirect(AppConstant.LINK_VERIFY_SUCCESS);
            else
                HttpContext.Response.Redirect(AppConstant.LINK_VERIFY_FAIL);
        }

        /// <summary>
        /// User can use their email to login. After login success, a refreshToken will be set in Headers automatically
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "Email": "test_email@gmail.com",
        ///        "Password": "Password@123"
        ///     }
        ///
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Successfully.",
        ///        "Errors": null,
        ///        "Data": {
        ///        "Id": "e3c5edfa-0646-42be-7149-08d95e03e37c",
        ///        "FirstName": "John",
        ///        "LastName": "Smith",
        ///        "Email": "test_email@gmail.com",
        ///        "Roles": ["User"],
        ///        "JwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X2VtYWlsQGdtYWlsLmNvbSIsImp0aSI6ImEyY2JlYjkzLTVkNDctNGEyMy05MjliLWU2OTNjZDI5NzA1ZSIsImVtYWlsIjoidGVzdF9lbWFpbEBnbWFpbC5jb20iLCJ1aWQiOiJhZDc3OTk1Yi03MmE5LTRhMzktM2U2ZS0wOGQ5NWUzYjc4ZWEiLCJyb2xlcyI6IlVzZXIiLCJleHAiOjE2Mjg4NTcyNTEsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6IlNlY3VyZUFwaVVzZXIifQ.k5r3eUX5RThaJED4sf7_Ek7OyLJzvjuMSCAUOmMztFs"  
        ///         }
        ///     }
        ///
        /// </remarks>
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest model)
        {
            var result = await _accountService.Authenticate(model, GetIpAddress());

            if (!string.IsNullOrEmpty(result.Data?.Token))
                SetRefreshTokenInCookie(result.Data?.RefreshToken);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// Revoke specify token
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "Token": "7681ACFEA8826CAC24B43464F74AE9A230F1C50341D8DC8508C19C5510CE0B40A9719BF640F2042C",
        ///     }
        ///
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Revoke token successfully.",
        ///        "Errors": null,
        ///        "Data": null
        ///     }
        ///
        /// </remarks>
        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest model)
        {
            var token = model.Token ?? Request.Cookies["refreshToken"];

            var result = await _accountService.RevokeToken(token, CurrentUser, GetIpAddress());

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// If jwtToken was expired , use this api to get new jwtToken
        /// </summary>
        /// /// <remarks>
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Successfully.",
        ///        "Errors": null,
        ///        "Data": {
        ///        "Id": "e3c5edfa-0646-42be-7149-08d95e03e37c",
        ///        "FirstName": "John",
        ///        "LastName": "Smith",
        ///        "Email": "test_email@gmail.com",
        ///        "Roles": ["User"],
        ///        "JwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X2VtYWlsQGdtYWlsLmNvbSIsImp0aSI6ImEyY2JlYjkzLTVkNDctNGEyMy05MjliLWU2OTNjZDI5NzA1ZSIsImVtYWlsIjoidGVzdF9lbWFpbEBnbWFpbC5jb20iLCJ1aWQiOiJhZDc3OTk1Yi03MmE5LTRhMzktM2U2ZS0wOGQ5NWUzYjc4ZWEiLCJyb2xlcyI6IlVzZXIiLCJleHAiOjE2Mjg4NTcyNTEsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6IlNlY3VyZUFwaVVzZXIifQ.k5r3eUX5RThaJED4sf7_Ek7OyLJzvjuMSCAUOmMztFs"  
        ///         }
        ///     }
        ///
        /// </remarks>
        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            var result = await _accountService.RefreshToken(refreshToken, GetIpAddress());

            if (result.IsSuccess) SetRefreshTokenInCookie(result.Data.RefreshToken);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// An email contain code will be sent to email, user can use that code to validate reset token
        /// </summary>
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _accountService.ForgotPassword(request);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// User use their code (in email) to validate. After validate success, user use new code in response to reset password
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "Email": "test_email@gmail.com",
        ///        "Token": "DTV2MBTY6K"
        ///     }
        ///
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Successfully.",
        ///        "Errors": null,
        ///        "Data": {
        ///             "Token": "VU89B7535P"
        ///         }
        ///     }
        ///
        /// </remarks>
        [AllowAnonymous]
        [HttpPost("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken([FromBody] ValidateResetTokenRequest request)
        {
            var result = await _accountService.ValidateResetToken(request);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// User use token (only use response of API (validate-reset-token) to reset password
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "Email": "test_email@gmail.com",
        ///        "Token": "VU89B7535P",
        ///        "Password": "Password@12345678",
        ///        "ConfirmPassword": "Password@12345678"
        ///     }
        ///
        /// Sample response:
        ///
        ///     {
        ///        "StatusCode": 200,
        ///        "IsSuccess": true,
        ///        "Message": "Successfully.",
        ///        "Errors": null,
        ///        "Data": null
        ///     }
        ///
        /// </remarks>
        /// 
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _accountService.ResetPassword(request);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// Get detail of user
        /// </summary>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            //users can get their own account and admins can get any account
            if (id != CurrentUserId && !CurrentUser.Roles.Contains(Roles.Admin.ToString()))
                return new JsonResult(new ResponseFail<bool>((int)HttpStatusCode.Unauthorized, AppConstant.UNAUTHORIZED))
                { StatusCode = StatusCodes.Status401Unauthorized };

            var result = await _accountService.GetById(id);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        /// <summary>
        /// Role 'Admin' can create new account
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRequest request)
        {
            var result = await _accountService.Create(request);

            return new ObjectResult(result) { StatusCode = result.StatusCode };
        }

        #region Helper methods
        private void SetRefreshTokenInCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(AppConstant.REFRESH_TOKEN_EXPIRED_IN_DAY),
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        private string GetIpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];

            if (HttpContext.Connection.RemoteIpAddress != null)
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            return null;
        }
        #endregion
    }
}