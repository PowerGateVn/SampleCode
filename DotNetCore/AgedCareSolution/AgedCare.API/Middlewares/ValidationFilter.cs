using AgedCare.Application.Errors;
using AgedCare.Application.Wrappers.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AgedCare.API.Middlewares
{
    public class ValidationFilter : IAsyncActionFilter
    {
        public ValidationFilter()
        {

        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            try
            {
                if (!context.ModelState.IsValid)
                {
                    var listErrorStr = context.ModelState
                                        .Where(x => x.Value.Errors.Count > 0)
                                        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.Select(x => x.ErrorMessage))
                                        .SelectMany(x => x.Value).ToList();

                    var errorsInModelState = context.ModelState
                                        .Where(x => x.Value.Errors.Count > 0)
                                        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.Select(x => x.ErrorMessage)).ToArray();

                    var errorResponse = new ErrorResponse();

                    foreach (var error in errorsInModelState)
                    {
                        foreach (var subError in error.Value)
                        {
                            var errorModel = new ErrorModel
                            {
                                FieldName = error.Key,
                                Message = subError
                            };

                            errorResponse.Errors.Add(errorModel);
                        }
                    }

                    var responseReturn = new BaseResponse<ErrorResponse>()
                    {
                        StatusCode = (int)HttpStatusCode.BadRequest,
                        IsSuccess = false,
                        Message = "Validation failed.",
                        Errors = listErrorStr,
                        Data = null
                    };

                    context.Result = new ObjectResult(responseReturn) { StatusCode = (int)HttpStatusCode.BadRequest };

                    return;
                }
            }
            catch (Exception e)
            {
                Log.Fatal(e, "OnActionExecutionAsync {@context}", context);
            }

            await next();
        }
    }
}