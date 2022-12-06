using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Application.Dto.Responses.Accounts;
using AgedCare.Application.Errors;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Enums;
using Bogus;
using FluentAssertions;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace AgedCare.Tests.AccountsTest
{
    public class AccountsControllerTest : IntegrationTest
    {
        #region Register
        [Fact]
        public async Task Register_FirstName_Is_Not_Valid()
        {
            RegisterRequest registerModel = new RegisterRequest
            {
                FirstName = "",
                LastName = TestConstant.DefaultUserLastName,
                Email = TestConstant.DefaultUserEmail,
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(registerModel), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_LastName_Is_Not_Valid()
        {
            RegisterRequest registerModel = new RegisterRequest
            {
                FirstName = "test",
                LastName = "",
                Email = TestConstant.DefaultUserEmail,
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(registerModel), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_Email_Is_Empty()
        {
            RegisterRequest registerModel = new RegisterRequest
            {
                FirstName = TestConstant.DefaultUserFirstName,
                LastName = TestConstant.DefaultUserLastName,
                Email = "",
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(registerModel), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_Email_Is_Not_Valid()
        {
            RegisterRequest registerModel = new RegisterRequest
            {
                FirstName = TestConstant.DefaultUserFirstName,
                LastName = TestConstant.DefaultUserLastName,
                Email = "test@@gmail.com",
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(registerModel), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }


        [Fact]
        public async Task Register_Valid()
        {
            var (request, response) = await RegisterSuccess();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Register_EmailAlreadyTaken()
        {
            RegisterRequest rq1 = new RegisterRequest
            {
                FirstName = TestConstant.DefaultUserFirstName,
                LastName = TestConstant.DefaultUserLastName,
                Email = TestConstant.DefaultUserEmail,
                Password = TestConstant.DefaultPassword
            };

            var stringContent1 = new StringContent(JsonConvert.SerializeObject(rq1), Encoding.UTF8, "application/json");

            await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent1);


            RegisterRequest rq2 = new RegisterRequest
            {
                FirstName = TestConstant.DefaultUserFirstName,
                LastName = TestConstant.DefaultUserLastName,
                Email = TestConstant.DefaultUserEmail,
                Password = TestConstant.DefaultPassword
            };

            var stringContent2 = new StringContent(JsonConvert.SerializeObject(rq2), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent2);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResponseFail<string>>(content);

            result.Message.Should().Be(AppConstant.EMAIL_ALREADY_TAKEN);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
        #endregion

        #region Verify-Email
        [Fact]
        public async Task VerifyEmail_UserIdIsNull()
        {
            await RegisterSuccess();

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteAccountVerifyEmail}?token=abc123&userId=");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task VerifyEmail_Success()
        {
            var (registerRequest, httpResponseMessage) = await RegisterSuccess();

            var emailRegister = registerRequest.Email;
            var account = await UserManager.FindByEmailAsync(emailRegister);

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteAccountVerifyEmail}?token={account.VerificationToken}&userId={account.Id}");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        #endregion

        #region Authenticate
        [Fact]
        public async Task Authenticate_Email_Is_Empty()
        {
            var authenticateRequest = new AuthenticateRequest
            {
                Email = "",
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ResponseFail<string>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Authenticate_Password_Is_Empty()
        {
            var authenticateRequest = new AuthenticateRequest
            {
                Email = TestConstant.DefaultUserEmail,
                Password = ""
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ResponseFail<string>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Authenticate_AccountNotFound()
        {
            var authenticateRequest = new AuthenticateRequest
            {
                Email = "test123@gmail.com",
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ResponseFail<AuthenticationResponse>>(content);

            result.Message.Should().Be(AppConstant.ACCOUNT_NOT_FOUND);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task Authenticate_InvalidPassword()
        {
            var userAccount = await AddRandomAccount(Roles.User);

            var authenticateRequest = new AuthenticateRequest
            {
                Email = userAccount.Email,
                Password = "Pasword12345678@"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ResponseFail<AuthenticationResponse>>(content);

            result.Message.Should().Be(AppConstant.INVALID_PASSWORD);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Authenticate_EmailNotConfirm()
        {
            RegisterRequest registerRequest = TestConstant.GenerateDefaultUserRegisterRequest();

            var stringContentRegisterRequest = new StringContent(JsonConvert.SerializeObject(registerRequest), Encoding.UTF8, "application/json");

            await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContentRegisterRequest);


            var authenticateRequest = new AuthenticateRequest
            {
                Email = registerRequest.Email,
                Password = registerRequest.Password
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ResponseFail<AuthenticationResponse>>(content);

            result.Message.Should().Be(AppConstant.EMAIL_NOT_CONFIRMED_YET);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Authenticate_Success()
        {
            var userAccount = await AddRandomAccount(Roles.User);

            var authenticateRequest = new AuthenticateRequest
            {
                Email = userAccount.Email,
                Password = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(authenticateRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountAuthenticate}", stringContent);

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<BaseResponse<AuthenticationResponse>>(content);

            result.Message.Should().Be(AppConstant.SUCCESS);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
        #endregion

        #region GetById
        [Fact]
        public async Task GetById_UserGetOwnAccount()
        {
            var accountUser = await AddRandomAccount(Roles.User);

            await AuthenticateAsync(accountUser);

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteAccount}/{accountUser.Id}");

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<AccountResponse>>(content);

            result.Message.Should().Be(AppConstant.SUCCESS);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetById_AdminGetOtherAccount_NotExist()
        {
            var accountAdmin = await AddRandomAccount(Roles.Admin);
            await AuthenticateAsync(accountAdmin);

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteAccount}/{Guid.NewGuid()}");

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<AccountResponse>>(content);

            result.Message.Should().Be(AppConstant.ACCOUNT_NOT_FOUND);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        #endregion

        #region Forgot Password
        [Fact]
        public async Task ForgotPassword_Email_Is_Empty()
        {
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                Email = "",
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ForgotPassword_AccountNotFound()
        {
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                Email = "abc@gmail.com",
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResponseFail<bool>>(content);

            result.Message.Should().Be(AppConstant.ACCOUNT_NOT_FOUND);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task ForgotPassword_Success()
        {
            await RegisterSuccess();

            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                Email = TestConstant.DefaultUserEmail
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResponseSuccess<bool>>(content);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
        #endregion

        #region Validate Reset Token
        [Fact]
        public async Task ValidateResetToken_Token_Is_Empty()
        {
            var validateResetTokenRequest = new ValidateResetTokenRequest
            {
                Token = "",
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(validateResetTokenRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountValidateResetToken}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ValidateResetToken_InvalidToken()
        {
            var (registerRequest, httpResponseMessage) = await RegisterSuccess();

            var emailRegister = registerRequest.Email;
            var account = await UserManager.FindByEmailAsync(emailRegister);

            ForgotPasswordRequest forgotPasswordRequest = new ForgotPasswordRequest()
            {
                Email = emailRegister
            };

            var stringContentForgotPassword = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");
            await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContentForgotPassword);

            var validateResetTokenRequest = new ValidateResetTokenRequest
            {
                Email = emailRegister,
                Token = "abc",
            };

            var stringContentValidate = new StringContent(JsonConvert.SerializeObject(validateResetTokenRequest), Encoding.UTF8, "application/json");

            var responseValidate = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountValidateResetToken}", stringContentValidate);

            var contentValidate = await responseValidate.Content.ReadAsStringAsync();
            var resultValidate = JsonConvert.DeserializeObject<BaseResponse<ValidateResetTokenResponse>>(contentValidate);

            resultValidate.Message.Should().Be(AppConstant.INVALID_TOKEN);
            responseValidate.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ValidateResetToken_Success()
        {
            var (registerRequest, httpResponseMessage) = await RegisterSuccess();
            var emailRegister = registerRequest.Email;

            //forgot
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                Email = emailRegister
            };

            var stringContentForgotPassword = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");

            await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContentForgotPassword);

            var account = await UserManager.FindByEmailAsync(emailRegister);
            var token = account.ResetToken;

            //validate
            ValidateResetTokenRequest validateResetTokenRequest = new ValidateResetTokenRequest()
            {
                Email = emailRegister,
                Token = token
            };
            var stringContentValidate = new StringContent(JsonConvert.SerializeObject(validateResetTokenRequest), Encoding.UTF8, "application/json");

            var responseValidate = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountValidateResetToken}", stringContentValidate);
            var contentValidate = await responseValidate.Content.ReadAsStringAsync();
            var resultValidate = JsonConvert.DeserializeObject<BaseResponse<ValidateResetTokenResponse>>(contentValidate);

            resultValidate.Message.Should().Be(AppConstant.SUCCESS);
            responseValidate.StatusCode.Should().Be(HttpStatusCode.OK);
        }
        #endregion

        #region Reset password
        [Fact]
        public async Task ResetPassword_TokenIsNull()
        {
            var resetPasswordRequest = new ResetPasswordRequest
            {
                Token = null,
                Password = TestConstant.DefaultPassword,
                ConfirmPassword = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(resetPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountResetPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ResetPassword_PasswordDoesNotMatch()
        {
            var resetPasswordRequest = new ResetPasswordRequest
            {
                Token = "Abc",
                Password = TestConstant.DefaultPassword,
                ConfirmPassword = "Abc"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(resetPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountResetPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.Errors.Should().Contain(AppConstant.PASSWORD_DOEST_NOT_MATCH);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }


        [Fact]
        public async Task ResetPassword_Success()
        {
            var (registerRequest, httpResponseMessage) = await RegisterSuccess();
            var emailRegister = registerRequest.Email;

            //forgot
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                Email = emailRegister
            };

            var stringContentForgotPassword = new StringContent(JsonConvert.SerializeObject(forgotPasswordRequest), Encoding.UTF8, "application/json");

            await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountForgotPassword}", stringContentForgotPassword);

            var account = await UserManager.FindByEmailAsync(emailRegister);
            var token = account.ResetToken;

            //validate
            ValidateResetTokenRequest validateResetTokenRequest = new ValidateResetTokenRequest()
            {
                Email = emailRegister,
                Token = token
            };
            var stringContentValidate = new StringContent(JsonConvert.SerializeObject(validateResetTokenRequest), Encoding.UTF8, "application/json");

            var responseValidate = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountValidateResetToken}", stringContentValidate);
            var contentValidate = await responseValidate.Content.ReadAsStringAsync();
            var resultValidate = JsonConvert.DeserializeObject<BaseResponse<ValidateResetTokenResponse>>(contentValidate);

            var tokenNew = resultValidate.Data.Token;

            //Reset
            var resetPasswordRequest = new ResetPasswordRequest
            {
                Email = emailRegister,
                Token = tokenNew,
                Password = TestConstant.DefaultPassword,
                ConfirmPassword = TestConstant.DefaultPassword
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(resetPasswordRequest), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountResetPassword}", stringContent);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<string>>(content);

            result.Message.Should().Be(AppConstant.CHANGE_PASSWORD_SUCCESS);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        #endregion

        #region Helper methods
        public async Task<(RegisterRequest, HttpResponseMessage)> RegisterSuccess()
        {
            var testRegister = new Faker<RegisterRequest>()
                .RuleFor(u => u.FirstName, (f, u) => f.Name.FirstName())
                .RuleFor(u => u.LastName, (f, u) => f.Name.LastName())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
                .RuleFor(u => u.Password, TestConstant.DefaultPassword);


            //RegisterRequest registerModel = TestConstant.GenerateDefaultUserRegisterRequest();
            RegisterRequest registerModel = testRegister.Generate();

            var stringContent = new StringContent(JsonConvert.SerializeObject(registerModel), Encoding.UTF8, "application/json");

            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteAccountRegister}", stringContent);

            return (registerModel, response);
        }
        #endregion
    }
}