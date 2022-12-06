using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AgedCare.Application.Dto.Responses.Accounts
{
    public class AuthenticationResponse
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public List<string> Roles { get; set; }

        public string Token { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}