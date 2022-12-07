using System;
using System.Collections.Generic;

namespace AgedCare.Application.Dto.Responses.Accounts
{
    public class AccountResponse
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public List<string> Roles { get; set; } = new();

        public bool IsVerified { get; set; }
    }
}