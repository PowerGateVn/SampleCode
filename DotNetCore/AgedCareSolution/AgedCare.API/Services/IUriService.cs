using AgedCare.Application.Wrappers.Requests;
using System;

namespace AgedCare.API.Services
{
    public interface IUriService
    {
        public Uri GetPageUri(PaginationFilterRequest paginationFilter, string route);
    }
}