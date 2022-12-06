using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.Accounts;
using FluentValidation;

namespace AgedCare.Application.Validations
{
    public class RevokeTokenRequestValidator : AbstractValidator<RevokeTokenRequest>
    {
        public RevokeTokenRequestValidator()
        {
            RuleFor(p => p.Token).NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);
        }
    }
}