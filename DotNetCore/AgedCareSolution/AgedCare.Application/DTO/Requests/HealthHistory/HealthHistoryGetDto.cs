using System;

namespace AgedCare.Application.Dto.Requests.HealthHistory
{
    public class HealthHistoryGetDto : HealthHistoryDto
    {
        public Guid Id { get; set; }
    }
}
