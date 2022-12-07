using AgedCare.Domain.Entities;
using AgedCare.Infrastructure.Contexts;
using System;

namespace AgedCare.Infrastructure.Persistence
{
    public class HealthHistoryRepository : BaseRepository<HealthHistory, Guid>, IHealthHistoryRepository
    {
        public HealthHistoryRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
