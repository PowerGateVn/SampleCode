using AgedCare.Application.Dto.Requests.Accounts;

namespace AgedCare.Tests
{
    public class TestConstant
    {
        public static string DefaultRoute = "https://localhost:44313/api";

        public static string DefaultRouteAccount = DefaultRoute + "/Accounts";
        public static string DefaultRouteAccountRegister = DefaultRouteAccount + "/Register";
        public static string DefaultRouteAccountAuthenticate = DefaultRouteAccount + "/Authenticate";
        public static string DefaultRouteAccountVerifyEmail = DefaultRouteAccount + "/verify-email";
        public static string DefaultRouteAccountForgotPassword = DefaultRouteAccount + "/forgot-password";
        public static string DefaultRouteAccountValidateResetToken = DefaultRouteAccount + "/validate-reset-token";
        public static string DefaultRouteAccountResetPassword = DefaultRouteAccount + "/reset-password";

        public static string DefaultPassword = "Password@123";
        public static string DefaultUserEmail = "default_user@gmail.com";

        public static string DefaultUserFirstName = "FirstName Test";
        public static string DefaultUserLastName = "LastName Test";

        // Health History
        public static string DefaultRouteHealthHistory = DefaultRoute + "/health-history";
        public static string DefaultRouteHealthHistoryGetWithPaging = DefaultRouteHealthHistory + "/get";
        public static string DefaultRouteHealthHistoryAdd = DefaultRouteHealthHistory + "/add";
        public static string DefaultRouteHealthHistoryUpdate = DefaultRouteHealthHistory + "/update";
        public static string DefaultRouteHealthHistoryDelete = DefaultRouteHealthHistory + "/delete";
        public static string DefaultRouteHealthHistoryGetById = DefaultRouteHealthHistory + "/get";
        public static string DefaultRouteHealthHistoryAddMany = DefaultRouteHealthHistory + "/add-many";
        public static string DefaultRouteHealthHistoryDeleteMany = DefaultRouteHealthHistory + "/delete-many";

        public static RegisterRequest GenerateDefaultUserRegisterRequest()
        {
            return new RegisterRequest
            {
                FirstName = DefaultUserFirstName,
                LastName = DefaultUserLastName,
                Email = DefaultUserEmail,
                Password = DefaultPassword
            };
        }
    }
}