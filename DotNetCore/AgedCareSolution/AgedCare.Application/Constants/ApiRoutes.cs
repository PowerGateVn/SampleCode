namespace AgedCare.Application.Constants
{
    public class ApiRoutes
    {

        public const string Base = "api";
        public static class Account
        {
            public const string ControllerName = "accounts";
            public const string Authenticate = Base + "/" + ControllerName + "/authenticate";
            public const string Register = Base + "/" + ControllerName + "/register";
            public const string RefreshToken = Base + "/" + ControllerName + "/refresh-token";
        }

    }
}