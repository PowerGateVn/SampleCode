using System.Collections.Generic;
using System.Net;

namespace AgedCare.Application.Wrappers.Responses
{
    public class ResponseFail<T> : BaseResponse<T>
    {
        public ResponseFail()
        {
            StatusCode = (int)(HttpStatusCode.BadRequest);
            IsSuccess = false;
        }

        public ResponseFail(string message)
        {
            IsSuccess = false;
            StatusCode = (int)(HttpStatusCode.BadRequest);
            Message = message;
        }

        public ResponseFail(int statusCode, string message, T data, List<string> errors)
        {
            StatusCode = statusCode;
            IsSuccess = false;
            Message = message;
            Errors = errors;
            Data = data;
        }

        public ResponseFail(int statusCode, string message, List<string> errors)
        {
            StatusCode = statusCode;
            IsSuccess = false;
            Message = message;
            Errors = errors;
        }

        public ResponseFail(int statusCode, string message, T data)
        {
            StatusCode = statusCode;
            IsSuccess = false;
            Message = message;
            Data = data;
        }

        public ResponseFail(int statusCode, string message)
        {
            StatusCode = statusCode;
            IsSuccess = false;
            Message = message;
        }
    }
}