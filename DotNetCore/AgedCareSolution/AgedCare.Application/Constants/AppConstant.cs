using System;

namespace AgedCare.Application.Constants
{
    public static class AppConstant
    {
        public const int PageIndex = 1;

        public const int PageSize = 10;

        public static string LINK_VERIFY_SUCCESS = "/verify-success.html";
        public static string LINK_VERIFY_FAIL = "/verify-fail.html";

        public static int RESET_TOKEN_EXPIRED_IN_DAY = 1;
        public static int REFRESH_TOKEN_EXPIRED_IN_DAY = 7;

        public static string REVOKE_TOKEN_FAIL = "Revoke token fail.";
        public static string REVOKE_TOKEN_SUCCESS = "Revoke token successfully.";

        public static string UNAUTHORIZED = "Unauthorized.";

        public static string THERE_IS_SOME_THING_WENT_WRONG = "There's something went wrong. Please try again.";

        public static string UPDATED_SUCCESS = "Updated Successfully";

        public static string NOT_FOUND = "Not found";

        public static string INVALID_TOKEN = "Invalid token.";

        public static string SUCCESS = "Success.";

        public static string DELETE_SUCCESS = "Deleted Successfully";

        public static string DELETE_FAILED = "Deleted Failed";

        public static string BAD_REQUEST = "Bad Request";

        public static string A_VALID_EMAIL_IS_REQUIRED = "A valid email is required.";

        public static string PROPERTY_NAME_SHOULD_NOT_BE_EMPTY = "{PropertyName} should be not empty.";
        public static string PASSWORD_DOEST_NOT_MATCH = "Passwords don't match. Please enter the same password in both password fields.";

        public static string A_VALID_ROLE_IS_REQUIRED = "A valid role is required.";

        public static string EMAIL_IS_ALREADY_TAKEN = "Email is already taken.";

        public static string CONFIRM_FAIL = "Confirm failed.";
        public static string CONFIRM_SUCCESSFULLY = "Confirm successfully.";

        public static string CHANGE_PASSWORD_SUCCESSFULLY = "Change password successfully.";

        public static string VALIDATION_FAIL = "Validation failed.";

        public static string ACCOUNT_NOT_FOUND = "Account not found.";

        public static string EMAIL_ALREADY_TAKEN = "Email is already taken.";

        public static string INVALID_PASSWORD = "Invalid password.";
        public static string EMAIL_NOT_CONFIRMED_YET = "Email not confirmed yet.";
        public static string CHANGE_PASSWORD_SUCCESS = "Change password successfully.";

        public static string HEALTH_HISTORY_NOT_FOUND = "Health History not found!";
    }
}
