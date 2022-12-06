using AgedCare.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Security.Claims;

namespace AgedCare.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        protected UserManager<ApplicationUser> _userManager;

        public BaseController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        protected ApplicationUser CurrentUser
        {
            get
            {
                ApplicationUser currentUser = null;

                try
                {
                    currentUser = (ApplicationUser)HttpContext.Items["Account"];
                }
                catch (Exception e)
                {
                    Log.Fatal(e, "Error in CurrentUser");
                }

                return currentUser;
            }
        }

        protected Guid CurrentUserId
        {
            get
            {
                var currentUserId = Guid.NewGuid();

                try
                {
                    var userId = ((ClaimsIdentity)User.Identity).FindFirst("uid").Value;
                    currentUserId = Guid.Parse(userId);
                }
                catch (Exception e)
                {
                    Log.Fatal(e, "Error in CurrentUserId");
                }

                return currentUserId;
            }
        }
    }
}