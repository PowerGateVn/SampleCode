using AgedCare.Application.Dto.Requests.Accounts;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace AgedCare.Infrastructure.Seeds
{
    public class SeedAccount
    {
        private const string AdminAccountId = "60B1B5DF-96A3-42CF-8E39-E35F0955D9B1";
        private const string AdminRoleId = "18A45B0B-140B-48CE-9611-146F0D5912E1";
        private const string AdminEmailDefault = "admin_default@gmail.com";
        private const string AdminPasswordDefault = "Password@123";
        private const string AdminFirstNameDefault = "Admin";
        private const string AdminLastNameDefault = "Admin";

        private const string UserAccountId = "BA2224D6-44F9-40B5-A5B8-91EFA1844AD2";
        private const string UserRoleId = "12624FD8-1C06-42A2-BE01-478694C800F9";
        private const string UserEmailDefault = "user_default@gmail.com";
        private const string UserPasswordDefault = "Password@123";
        private const string UserFirstNameDefault = "User";
        private const string UserLastNameDefault = "User";

        public static async Task SeedDefaultData(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            await SeedRole(roleManager, Guid.Parse(AdminRoleId), Roles.Admin.ToString());
            await SeedRole(roleManager, Guid.Parse(UserRoleId), Roles.User.ToString());

            var adminAccount = await SeedAccountToDb(userManager,
                 Guid.Parse(AdminAccountId),
                 new RegisterRequest
                 {
                     FirstName = AdminFirstNameDefault,
                     LastName = AdminLastNameDefault,
                     Email = AdminEmailDefault,
                     Password = AdminPasswordDefault
                 });

            var userAccount = await SeedAccountToDb(userManager,
                  Guid.Parse(UserAccountId),
                  new RegisterRequest
                  {
                      FirstName = UserFirstNameDefault,
                      LastName = UserLastNameDefault,
                      Email = UserEmailDefault,
                      Password = UserPasswordDefault
                  });

            await AddAccountToRole(userManager, adminAccount, Roles.Admin.ToString());
            await AddAccountToRole(userManager, userAccount, Roles.User.ToString());
        }

        private static async Task<ApplicationUser> SeedAccountToDb(UserManager<ApplicationUser> userManager, Guid accountId, RegisterRequest request)
        {
            var account = await userManager.FindByIdAsync(accountId.ToString());

            if (account == null)
            {
                account = new ApplicationUser
                {
                    Id = accountId,
                    Email = request.Email,
                    NormalizedEmail = request.Email.ToUpper(),
                    UserName = request.Email,
                    NormalizedUserName = request.Email.ToUpper(),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Verified = DateTime.UtcNow
                };

                await userManager.CreateAsync(account, AdminPasswordDefault);
            }

            return account;
        }

        private static async Task SeedRole(RoleManager<ApplicationRole> roleManager, Guid roleId, string roleName)
        {
            var role = await roleManager.FindByIdAsync(roleId.ToString());

            if (role == null)
            {
                role = new ApplicationRole
                {
                    Id = roleId,
                    Name = roleName,
                    NormalizedName = roleName.ToUpper()
                };

                await roleManager.CreateAsync(role);
            }
        }

        private static async Task AddAccountToRole(UserManager<ApplicationUser> userManager, ApplicationUser account, string roleName)
        {
            var isInRole = await userManager.IsInRoleAsync(account, roleName);

            if (!isInRole)
            {
                await userManager.AddToRoleAsync(account, roleName);
            }
        }
    }
}
