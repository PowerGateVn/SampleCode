using AgedCare.Application.Constants;
using AgedCare.Application.Exceptions;
using AgedCare.Application.Wrappers.Responses;
using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace AgedCare.API.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                if (error is ExceptionCustom exceptionCustom)
                    WriteLogToDatabase(exceptionCustom);


                var responseModel = new BaseResponse<string>
                {
                    IsSuccess = false,
                    Message = AppConstant.THERE_IS_SOME_THING_WENT_WRONG,
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var result = JsonSerializer.Serialize(responseModel);

                await context.Response.WriteAsync(result);
            }
        }

        private void WriteLogToDatabase(ExceptionCustom ec)
        {
            try
            {
                if (ec.ObjLog != null)
                {
                    Log.Error(ec, ec.FunctionName + " {@objLog}", ec.ObjLog);
                }
                else
                {
                    Log.Error(ec, ec.FunctionName, ec.ObjLog);
                }
            }
            catch (Exception)
            {
                // ignored
            }
        }
    }
}