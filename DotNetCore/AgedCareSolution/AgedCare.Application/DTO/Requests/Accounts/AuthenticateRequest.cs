namespace AgedCare.Application.Dto.Requests.Accounts
{
    public class AuthenticateRequest
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }
}