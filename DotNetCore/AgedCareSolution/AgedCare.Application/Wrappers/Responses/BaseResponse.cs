using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace AgedCare.Application.Wrappers.Responses
{
    public class BaseResponse<T>
    {
        public int StatusCode { get; set; }

        public bool IsSuccess { get; set; }

        public string Message { get; set; }

        public List<string> Errors { get; set; }

        public T Data { get; set; }

        public BaseResponse()
        {

        }

        public BaseResponse(T data, string message = null)
        {
            IsSuccess = true;
            Message = message;
            Data = data;
        }

        public BaseResponse(string message)
        {
            IsSuccess = false;
            Message = message;
        }

        public BaseResponse(bool isSuccess, string message, List<string> errors, T data, int statusCode = (int)HttpStatusCode.OK)
        {
            StatusCode = statusCode;
            IsSuccess = isSuccess;
            Message = message;
            Errors = errors;
            Data = data;
        }

        public ObjectResult GetResponse(BaseResponse<T> response)
        {
            return new ObjectResult(response) { StatusCode = response.StatusCode };
        }
    }
}