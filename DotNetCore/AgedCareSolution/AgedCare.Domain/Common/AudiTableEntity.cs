using System;

namespace AgedCare.Domain.Common
{
    public abstract class AudiTableEntity<TId>
    {
        public TId Id { get; set; }

        public DateTime? CreatedDate { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public Guid? UpdatedBy { get; set; }
    }
}