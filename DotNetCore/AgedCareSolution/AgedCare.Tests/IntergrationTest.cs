using AgedCare.API;
using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Application.Dto.Responses.Accounts;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Enums;
using AgedCare.Infrastructure.Contexts;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace AgedCare.Tests
{
    public class IntegrationTest
    {
        protected readonly HttpClient TestClient;
        protected static ApplicationDbContext ApplicationDbContext;
        protected static UserManager<ApplicationUser> UserManager;
        protected static RoleManager<ApplicationRole> RoleManager;

        protected IntegrationTest()
        {
            var appFactory = new WebApplicationFactory<Startup>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(async services =>
                    {
                        var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                        if (descriptor != null)
                        {
                            services.Remove(descriptor);
                        }
                        services.AddDbContext<ApplicationDbContext>(
                            options =>
                            {
                                options.UseInMemoryDatabase("TestDb");
                                options.ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning));
                            });

                        ApplicationDbContext = services.BuildServiceProvider().GetService<ApplicationDbContext>();
                        UserManager = services.BuildServiceProvider().GetService<UserManager<ApplicationUser>>();
                        RoleManager = services.BuildServiceProvider().GetService<RoleManager<ApplicationRole>>();

                        await CreateRoleIfNotExist();
                    });
                });

            TestClient = appFactory.CreateClient();
        }

        public async Task AuthenticateAsync(ApplicationUser account)
        {
            TestClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", await GetJwtAsync(new AuthenticateRequest
            {
                Email = account.Email,
                Password = TestConstant.DefaultPassword
            }));
        }

        #region Helper methods
        public static async Task<ApplicationUser> AddRandomAccount(Roles role)
        {
            var hasherUser = new PasswordHasher<ApplicationUser>();

            var testAccount = new Faker<ApplicationUser>()
                .RuleFor(u => u.FirstName, (f, u) => f.Name.FirstName())
                .RuleFor(u => u.LastName, (f, u) => f.Name.LastName())
                .RuleFor(u => u.UserName, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
                .RuleFor(u => u.NormalizedUserName, (f, u) => f.Internet.Email(u.FirstName, u.LastName).ToUpper())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
                .RuleFor(u => u.NormalizedEmail, (f, u) => f.Internet.Email(u.FirstName, u.LastName).ToUpper())
                .RuleFor(u => u.Verified, DateTime.UtcNow)
                .RuleFor(u => u.PasswordHash, hasherUser.HashPassword(null, "Password@123"));

            var account = testAccount.Generate();

            await UserManager.CreateAsync(account);
            await UserManager.AddToRoleAsync(account, role.ToString());
            return account;
        }

        private async Task<string> GetJwtAsync(AuthenticateRequest authenticateRequest)
        {
            //Authenticate
            var responseLogin = await TestClient.PostAsJsonAsync(TestConstant.DefaultRouteAccountAuthenticate, authenticateRequest);

            //var refreshToken = GetCookie(responseLogin);
            var registrationResponse = await responseLogin.Content.ReadAsAsync<BaseResponse<AuthenticationResponse>>();

            return registrationResponse.Data.Token;
        }

        private async Task CreateRoleIfNotExist()
        {
            var listRoles = Enum.GetValues(typeof(Roles))
                .Cast<Roles>()
                .Select(v => v.ToString())
                .ToList();

            foreach (var role in listRoles)
            {
                if (!await RoleManager.RoleExistsAsync(role))
                {
                    await RoleManager.CreateAsync(new ApplicationRole(role));
                }
            }
        }

        private string GetCookie(HttpResponseMessage message)
        {
            message.Headers.TryGetValues("Set-Cookie", out var setCookie);
            var setCookieString = setCookie.Single();
            var cookieTokens = setCookieString.Split(';');
            var firstCookie = cookieTokens.FirstOrDefault();
            var keyValueTokens = firstCookie.Split('=');
            var valueString = keyValueTokens[1];
            var cookieValue = HttpUtility.UrlDecode(valueString);
            return cookieValue;
        }
        #endregion
    }
}