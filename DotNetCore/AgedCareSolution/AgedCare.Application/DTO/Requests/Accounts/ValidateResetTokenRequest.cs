namespace AgedCare.Application.Dto.Requests.Accounts
{
    public class ValidateResetTokenRequest
    {
        public string Email { get; set; }

        public string Token { get; set; }
    }
}