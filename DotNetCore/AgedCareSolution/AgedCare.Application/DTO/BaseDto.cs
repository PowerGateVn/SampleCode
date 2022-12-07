using System;
using Swashbuckle.AspNetCore.Annotations;

namespace AgedCare.Application.Dto
{
    public abstract class BaseDto<TId>
    {
        public TId Id { get; set; }

        [SwaggerSchema(ReadOnly = true)]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [SwaggerSchema(ReadOnly = true)]
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    }
}
