using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.HealthHistory;
using FluentValidation;

namespace AgedCare.Application.Validations.HealthHistory
{
    public class HealthHistoryDtoValidator : AbstractValidator<HealthHistoryDto>
    {
        public HealthHistoryDtoValidator()
        {
            RuleFor(p => p.RecordedDate)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);

            RuleFor(p => p.Title)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);
            
            RuleFor(p => p.Note)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);
            
            RuleFor(p => p.ImageUrl)
                .NotEmpty().WithMessage(AppConstant.PROPERTY_NAME_SHOULD_NOT_BE_EMPTY);
        }
    }
}