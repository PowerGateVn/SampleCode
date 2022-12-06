using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.Accounts;
using FluentValidation;

namespace AgedCare.Application.Validations
{
    public class ValidateResetTokenRequestValidator : AbstractValidator<ValidateResetTokenRequest>
    {
        public ValidateResetTokenRequestValidator()
        {
            RuleFor(p => p.Email)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY)
                .EmailAddress().WithMessage(AppConstant.A_VALID_EMAIL_IS_REQUIRED);

            RuleFor(p => p.Token)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);
        }
    }
}