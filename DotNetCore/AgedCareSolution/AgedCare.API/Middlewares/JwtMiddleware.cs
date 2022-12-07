using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgedCare.API.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JWTSettings _jwt;

        public JwtMiddleware(RequestDelegate next, IOptions<JWTSettings> appSettings)
        {
            _next = next;
            _jwt = appSettings.Value;
        }

        public async Task Invoke(HttpContext context, UserManager<ApplicationUser> userManager)
        {
            var token = context
                .Request
                .Headers["Authorization"]
                .FirstOrDefault()?
                .Split(" ")
                .Last();

            if (token != null) await AttachAccountToContext(context, token, userManager);

            await _next(context);
        }

        private async Task AttachAccountToContext(HttpContext context, string token, UserManager<ApplicationUser> userManager)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwt.Key);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var accountId = jwtToken.Claims.First(x => x.Type == "uid").Value;

                // attach account to context on successful jwt validation
                var account = await userManager.FindByIdAsync(accountId);

                if (account != null)
                {
                    var listRoles = await userManager.GetRolesAsync(account);
                    account.Roles = listRoles.ToList();
                }

                context.Items["Account"] = account;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "AttachAccountToContext {@context}", context);
            }
        }
    }
}