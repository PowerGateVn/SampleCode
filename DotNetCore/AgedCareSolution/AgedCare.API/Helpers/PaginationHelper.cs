using AgedCare.API.Services;
using AgedCare.Application.Wrappers.Requests;
using AgedCare.Application.Wrappers.Responses;
using System;
using System.Collections.Generic;

namespace AgedCare.API.Helpers
{
    public class PaginationHelper
    {
        public static PagedResponse<List<T>> CreatePagedResponse<T>(
            List<T> pagedData,
            PaginationFilterRequest validFilter,
            int totalRecords,
            IUriService uriService,
            string route)
        {
            var response = new PagedResponse<List<T>>(validFilter.PageIndex, validFilter.PageSize);

            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);
            int roundedTotalPages = Convert.ToInt32(Math.Ceiling(totalPages));

            response.NextPage = validFilter.PageIndex >= 1 && validFilter.PageIndex < roundedTotalPages
                ? uriService.GetPageUri(new PaginationFilterRequest(validFilter.PageIndex + 1, validFilter.PageSize), route)
                : null;

            response.PreviousPage = validFilter.PageIndex - 1 >= 1 && validFilter.PageIndex <= roundedTotalPages
                ? uriService.GetPageUri(new PaginationFilterRequest(validFilter.PageIndex - 1, validFilter.PageSize), route)
                : null;

            response.FirstPage = uriService.GetPageUri(new PaginationFilterRequest(1, validFilter.PageSize), route);
            response.LastPage = uriService.GetPageUri(new PaginationFilterRequest(roundedTotalPages, validFilter.PageSize), route);
            response.TotalPages = roundedTotalPages;
            response.TotalRecords = totalRecords;
            response.List = pagedData;

            return response;
        }
    }
}