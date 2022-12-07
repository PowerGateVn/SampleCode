using AgedCare.Application.Constants;

namespace AgedCare.Application.Wrappers.Requests
{
    public class PaginationFilterRequest
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public PaginationFilterRequest()
        {
            PageIndex = AppConstant.PageIndex;
            PageSize = AppConstant.PageSize;
        }

        public PaginationFilterRequest(int pageNumber, int pageSize)
        {
            PageIndex = pageNumber < 1 ? 1 : pageNumber;
            PageSize = pageSize;
        }
    }
}