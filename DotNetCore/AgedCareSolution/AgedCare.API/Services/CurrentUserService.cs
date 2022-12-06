using AgedCare.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Linq;

namespace AgedCare.API.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? Uid
        {
            get
            {
                try
                {
                    return Guid.Parse(_httpContextAccessor.HttpContext?.User?.Claims.SingleOrDefault(x => x.Type == "uid").Value);
                }
                catch (Exception e)
                {
                    Log.Error(e, "CurrentUserService {@_httpContextAccessor}", _httpContextAccessor);
                }

                return Guid.Empty;
            }
        }
    }
}