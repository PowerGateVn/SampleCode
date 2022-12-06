using System.Collections.Generic;
using System.Net;

namespace AgedCare.Application.Wrappers.Responses
{
    public class ResponseSuccess<T> : BaseResponse<T>
    {
        public ResponseSuccess()
        {
            IsSuccess = true;
            StatusCode = (int)HttpStatusCode.OK;
        }

        public ResponseSuccess(string message)
        {
            StatusCode = (int)HttpStatusCode.OK;
            IsSuccess = true;
            Message = message;
        }

        public ResponseSuccess(int statusCode, string message, T data, List<string> errors)
        {
            StatusCode = statusCode;
            IsSuccess = true;
            Message = message;
            Errors = errors;
            Data = data;
        }

        public ResponseSuccess(int statusCode, string message)
        {
            StatusCode = statusCode;
            IsSuccess = true;
            Message = message;
        }

        public ResponseSuccess(int statusCode, string message, T data)
        {
            StatusCode = statusCode;
            IsSuccess = true;
            Message = message;
            Data = data;
        }
    }
}