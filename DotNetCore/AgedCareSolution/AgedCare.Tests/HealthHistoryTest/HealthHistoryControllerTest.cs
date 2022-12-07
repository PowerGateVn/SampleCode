using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AgedCare.Application.Constants;
using AgedCare.Application.Errors;
using AgedCare.Application.Wrappers.Responses;
using AgedCare.Domain.Entities;
using AgedCare.Domain.Enums;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Xunit;

namespace AgedCare.Tests.HealthHistoryTest
{
    public class HealthHistoryControllerTest : IntegrationTest
    {
        #region Get list of Health History records
        [Fact]
        public async Task Get_Health_Histories_IfParamInValid()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            string pageIndex = "@123";
            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetWithPaging}?pageIndex={pageIndex}");
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.IsSuccess.Should().BeFalse();
        }

        [Fact]
        public async Task Get_Health_Histories_WithNoParam()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetWithPaging}");
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResponseSuccess<IEnumerable<HealthHistory>>>(content);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.IsSuccess.Should().BeTrue();
        }

        [Fact]
        public async Task Get_Health_Histories_ParamOutOfRange()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var totalRows = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).CountAsync();
            var totalPage = totalRows / 10;
            var pageIndex = totalPage + 1;
            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetWithPaging}?pageIndex={pageIndex}");

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<IEnumerable<HealthHistory>>>(content);

            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be(AppConstant.BAD_REQUEST);
        }

        [Fact]
        public async Task Get_Health_Histories_ParamLessThanZero()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            int pageIndex = -1;
            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetWithPaging}?pageIndex={pageIndex}");
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<IEnumerable<HealthHistory>>>(content);

            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be(AppConstant.BAD_REQUEST);
        }

        #endregion

        #region Get a Health History record
        [Fact]
        public async Task Get_Health_History_By_IdInvalid()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var idInvalid = -1;
            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetById}/{idInvalid}");
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<HealthHistory>>(content);

            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be(AppConstant.BAD_REQUEST);
        }

        [Fact]
        public async Task Get_Health_History_By_Id_NotFound()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var guid = Guid.NewGuid();
            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetById}/{guid}");
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<HealthHistory>>(content);

            result.Data.Should().Be(null);
            result.IsSuccess.Should().BeFalse();
        }

        [Fact]
        public async Task Get_Health_History_By_Id_MissParam()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var response = await TestClient.GetAsync($"{TestConstant.DefaultRouteHealthHistoryGetById}");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.IsSuccessStatusCode.Should().BeTrue();
        }

        #endregion

        #region Create new Health History record

        [Fact]
        public async Task Add_Health_History_RequiredTitle()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var healHistory = new HealthHistory
            {
                Id = Guid.Parse(Guid.NewGuid().ToString()),
                CreatedDate = DateTime.UtcNow,
                UserId = accountUser.Id,
                UpdatedDate = DateTime.UtcNow,
                RecordedDate = DateTime.UtcNow,
                Note = "Test Note",
                ImageUrl = "http://google.com"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAdd}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.IsSuccess.Should().BeFalse();
        }

        [Fact]
        public async Task Add_Health_History_RequiredNote()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var healHistory = new HealthHistory
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                UserId = accountUser.Id,
                UpdatedDate = DateTime.UtcNow,
                RecordedDate = DateTime.UtcNow,
                Title = "Test",
                ImageUrl = "http://google.com"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAdd}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.IsSuccess.Should().BeFalse();
        }

        [Fact]
        public async Task Add_Health_History_RequiredImage()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var healHistory = new HealthHistory
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                UserId = accountUser.Id,
                UpdatedDate = DateTime.UtcNow,
                RecordedDate = DateTime.UtcNow,
                Title = "Test",
                Note = "Test Note"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAdd}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.IsSuccess.Should().BeFalse();
        }

        [Fact]
        public async Task Add_Health_History_RequiredRecordedDate()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var healHistory = new HealthHistory
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                UserId = accountUser.Id,
                UpdatedDate = DateTime.UtcNow,
                Title = "Test",
                Note = "Test Note",
                ImageUrl = "http://google.com"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAdd}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.VALIDATION_FAIL);
            result.IsSuccess.Should().BeFalse();
        }
        #endregion

        #region Update a Health History record

        [Fact]
        public async Task Update_Health_History_IfNotFound()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var healHistory = new HealthHistory
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                UserId = accountUser.Id,
                UpdatedDate = DateTime.UtcNow,
                RecordedDate = DateTime.UtcNow,
                Title = "Test",
                Note = "Test Note",
                ImageUrl = "http://google.com"
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PutAsync($"{TestConstant.DefaultRouteHealthHistoryUpdate}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResponseFail<string>>(content);

            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be(AppConstant.HEALTH_HISTORY_NOT_FOUND);
        }

        [Fact]
        public async Task Update_Health_History_IfModelNull()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var healHistory = new HealthHistory { };
            var stringContent = new StringContent(JsonConvert.SerializeObject(healHistory), Encoding.UTF8, "application/json");
            var response = await TestClient.PutAsync($"{TestConstant.DefaultRouteHealthHistoryUpdate}", stringContent);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            response.IsSuccessStatusCode.Should().BeFalse();
        }
        #endregion

        #region Delete a Health History record

        [Fact]
        public async Task Delete_Health_History_IdWrongFormat()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var id = "#123";

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(id), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDelete}")
            };

            var response = await TestClient.SendAsync(request);

            response.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
            response.IsSuccessStatusCode.Should().BeFalse();
        }

        [Fact]
        public async Task Delete_Health_History_IfNotFound()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var id = Guid.NewGuid();

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(id), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDelete}")
            };

            var response = await TestClient.SendAsync(request);

            response.IsSuccessStatusCode.Should().BeFalse();
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        #endregion

        #region Create multi Health History records
        [Fact]
        public async Task Add_Multi_Health_History_IfParamIsEmpty()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var healthHistories = new List<HealthHistory>();

            var stringContent = new StringContent(JsonConvert.SerializeObject(healthHistories), Encoding.UTF8, "application/json");
            var response = await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAddMany}", stringContent);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<ErrorResponse>>(content);

            result.Message.Should().Be(AppConstant.BAD_REQUEST);
            result.IsSuccess.Should().BeFalse();
        }

        #endregion

        #region Delete multi Health History records
        [Fact]
        public async Task Delete_Multi_Health_History_IfAnyNotFound()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var heathHistory = await ApplicationDbContext.HealthHistories.FirstOrDefaultAsync(x => x.UserId == accountUser.Id);

            var healthHistoryIds = new[]
            {
                 Guid.NewGuid().ToString(),
                 heathHistory.Id.ToString(),
            };

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(healthHistoryIds), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDeleteMany}")
            };

            var response = await TestClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<string>>(content);

            result.IsSuccess.Should().BeTrue();
            result.Message.Should().Be(AppConstant.DELETE_SUCCESS);
        }

        [Fact]
        public async Task Delete_Multi_Health_History_IfAllNotFound()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var healthHistoryIds = new string[]
            {
                Guid.NewGuid().ToString(),
                Guid.NewGuid().ToString()
            };

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(healthHistoryIds), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDeleteMany}")
            };

            var response = await TestClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<string>>(content);

            result.IsSuccess.Should().BeFalse();
            result.Message.Should().Be(AppConstant.DELETE_FAILED);
        }

        [Fact]
        public async Task Delete_Multi_Health_History_IfListParamIsEmpty()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(""), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDeleteMany}")
            };

            var response = await TestClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<string>>(content);

            result.IsSuccess.Should().BeFalse();
            result.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Delete_Multi_Health_History_IfParamsDuplicate()
        {
            var accountUser = await AddRandomAccount(Roles.User);
            await AuthenticateAsync(accountUser);

            var hasData = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id).AnyAsync();
            if (!hasData) await CreateDumpData(accountUser.Id.ToString());

            var beforeDelete = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id)
                .CountAsync();

            var heathHistory =
                await ApplicationDbContext.HealthHistories.FirstOrDefaultAsync(x => x.UserId == accountUser.Id);

            var healthHistoryIds = new[]
            {
                heathHistory.Id.ToString(),
                heathHistory.Id.ToString()
            };

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(healthHistoryIds), Encoding.UTF8, "application/json"),
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{TestConstant.DefaultRouteHealthHistoryDeleteMany}")
            };

            var response = await TestClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<BaseResponse<string>>(content);

            var afterDelete = await ApplicationDbContext.HealthHistories.Where(x => x.UserId == accountUser.Id)
                .CountAsync();

            result.IsSuccess.Should().BeTrue();
            result.Message.Should().Be(AppConstant.DELETE_SUCCESS);
            afterDelete.Should().Be(beforeDelete - 1);
        }
        #endregion

        #region Helper

        private async Task CreateDumpData(string guid)
        {
            for (int i = 0; i <= 19; i++)
            {
                HealthHistory healthHistory = new HealthHistory
                {
                    UserId = Guid.Parse(guid),
                    RecordedDate = DateTime.Now,
                    Title = $"Test Title {i}",
                    Note = $"Test Note {i}",
                    ImageUrl = "http://google.com",
                    CreatedDate = DateTime.UtcNow,
                    Id = Guid.NewGuid(),
                    UpdatedDate = DateTime.UtcNow
                };

                var stringContent = new StringContent(JsonConvert.SerializeObject(healthHistory), Encoding.UTF8, "application/json");

                await TestClient.PostAsync($"{TestConstant.DefaultRouteHealthHistoryAdd}", stringContent);
            }
        }

        #endregion

    }
}
