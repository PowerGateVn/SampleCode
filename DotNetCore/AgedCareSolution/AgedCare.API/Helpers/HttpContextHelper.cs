using Microsoft.AspNetCore.Http;

namespace AgedCare.API.Helpers
{
    public static class HttpContextHelper
    {
        public static string GenerateConfirmLink(IHttpContextAccessor accessor, string verifyToken, string userId)
        {
            var scheme = accessor?.HttpContext?.Request.Scheme;
            var host = accessor?.HttpContext?.Request.Host;

            return $"{scheme}://{host}/api/accounts/verify-email?token={verifyToken}&userId={userId}";
        }
    }
}