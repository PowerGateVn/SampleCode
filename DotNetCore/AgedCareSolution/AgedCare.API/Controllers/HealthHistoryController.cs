using AgedCare.Application.Constants;
using AgedCare.Application.Dto.Requests.HealthHistory;
using AgedCare.Application.Utilities;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Infrastructure.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace AgedCare.API.Controllers
{
    [Route("api/health-history")]
    public class HealthHistoryController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IHealthHistoryRepository _healthHistoryRepository;

        public HealthHistoryController
            (UserManager<ApplicationUser> userManager,
            IMapper mapper,
            IHealthHistoryRepository healthHistoryRepository)
            : base(userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _healthHistoryRepository = healthHistoryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var healthHistories = await _healthHistoryRepository.GetAllAsync(null, null);
            var response = new BaseResponse<IEnumerable<HealthHistoryGetDto>>(true, null, null, _mapper.Map<IEnumerable<HealthHistoryGetDto>>(healthHistories));

            return response.GetResponse(response);
        }

        [HttpGet("get-list-paging")]
        public async Task<IActionResult> GetWithPaging(int pageIndex = AppConstant.PageIndex, int pageSize = AppConstant.PageSize, SortType sortType = SortType.Descending)
        {
            var healthHistories = await _healthHistoryRepository.GetWithPagingAsync(null, null, sortType, pageIndex, pageSize);
            var response = new BaseResponse<IEnumerable<HealthHistoryGetDto>>(true, null, null, _mapper.Map<IEnumerable<HealthHistoryGetDto>>(healthHistories));

            return response.GetResponse(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var healthHistory = await _healthHistoryRepository.GetByIdAsync(id);
            var response = new BaseResponse<HealthHistoryGetDto>(true, null, null, _mapper.Map<HealthHistoryGetDto>(healthHistory));

            if (healthHistory != null)
            {
                return response.GetResponse(response);
            }

            response.StatusCode = (int)HttpStatusCode.NotFound;
            response.IsSuccess = false;

            return response.GetResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] HealthHistoryDto healthHistoryDto)
        {
            var healthHistory = _mapper.Map<HealthHistory>(healthHistoryDto);
            healthHistory.UserId = CurrentUserId;
            var healthHistoryAdded = await _healthHistoryRepository.AddAsync(healthHistory);
            var response = new BaseResponse<HealthHistoryGetDto>(true, null, null, _mapper.Map<HealthHistoryGetDto>(healthHistoryAdded));

            return response.GetResponse(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] HealthHistoryDto healthHistoryDto)
        {
            var healthHistoryOriginal = await _healthHistoryRepository.GetByIdAsync(id);

            var response = new BaseResponse<HealthHistoryGetDto>(false, null, null, null, (int)HttpStatusCode.NotFound);

            if (healthHistoryOriginal == null)
            {
                return response.GetResponse(response);
            }

            healthHistoryOriginal.UpdatedBy = CurrentUserId;

            var healthHistory = await _healthHistoryRepository.UpdateAsync(_mapper.Map(healthHistoryDto, healthHistoryOriginal));

            response.StatusCode = (int)HttpStatusCode.OK;
            response.IsSuccess = true;
            response.Data = _mapper.Map<HealthHistoryGetDto>(healthHistory);

            return response.GetResponse(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var isDeleteSuccess = await _healthHistoryRepository.DeleteByIdAsync(id);
            var response = new BaseResponse<object>(true, null, null, null);

            if (isDeleteSuccess)
            {
                return response.GetResponse(response);
            }

            response.StatusCode = (int)HttpStatusCode.NotFound;
            response.Message = AppConstant.DELETE_FAILED;
            response.IsSuccess = false;

            return response.GetResponse(response);
        }

        [HttpPost("delete-range")]
        public async Task<IActionResult> DeleteRange([FromBody] IEnumerable<Guid> ids)
        {
            var isDeleteSuccess = await _healthHistoryRepository.DeleteByIdsAsync(ids);
            var response = new BaseResponse<object>(true, null, null, null);

            if (isDeleteSuccess)
            {
                return response.GetResponse(response);
            }

            response.StatusCode = (int)HttpStatusCode.NotFound;
            response.Message = AppConstant.DELETE_FAILED;
            response.IsSuccess = false;

            return response.GetResponse(response);
        }

        [HttpPost("add-range")]
        public async Task<IActionResult> AddRange([FromBody] List<HealthHistoryDto> healthHistoryDto)
        {
            var healthHistories = _mapper.Map<List<HealthHistoryDto>, List<HealthHistory>>(healthHistoryDto);
            healthHistories.ForEach(t => t.UserId = CurrentUserId);

            var healthHistoriesAdded = await _healthHistoryRepository.AddRangeAsync(healthHistories);
            var response = new BaseResponse<IEnumerable<HealthHistoryGetDto>>(true, null, null, _mapper.Map<IEnumerable<HealthHistoryGetDto>>(healthHistoriesAdded));

            return response.GetResponse(response);
        }
    }
}
