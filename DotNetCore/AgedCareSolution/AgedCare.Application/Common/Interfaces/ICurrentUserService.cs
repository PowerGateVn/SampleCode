using System;

namespace AgedCare.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? Uid { get; }
    }
}