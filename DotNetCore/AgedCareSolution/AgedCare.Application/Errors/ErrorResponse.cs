using System.Collections.Generic;

namespace AgedCare.Application.Errors
{
    public class ErrorResponse
    {
        public ErrorResponse()
        {

        }

        public ErrorResponse(ErrorModel error)
        {
            Errors.Add(error);
        }

        public List<ErrorModel> Errors { get; set; } = new();
    }
}