using AgedCare.Domain.Entities;
using System;

namespace AgedCare.Infrastructure.Persistence
{
    public interface IHealthHistoryRepository : IRepository<HealthHistory, Guid>
    {
    }
}