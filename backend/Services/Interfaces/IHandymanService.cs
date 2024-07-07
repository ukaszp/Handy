using Handy.Api.Data.DTOs;
using Handy.Entities;
using HandyApi.DTOs;

namespace Handy.Api.Services.Interfaces
{
    public interface IHandymanService
    {
        Task<List<Skill>> AddHandymanSkillsAsync(List<int> skillids, int handymanInfoId);
        Task<HandymanInfo> DeleteHandymanAsync(int handymanInfoId);
        Task<List<HandymanDto>> GetAllActiveHandymanAsync(int pageNumber, int pageSize);
        Task<List<HandymanDto>> GetAllHandymanInfosAsync();
        Task<User> GetHandymanAccountInfoAsync(int handymanInfoId);
        Task<HandymanDto> GetHandymanAsync(int handymanInfoId);
        Task<HandymanInfo> GetHandymanByUserIdAsync(int userid);
        Task<List<Rating>> GetHandymanRatingsAsync(int handymanInfoId);
        Task<List<Skill>> GetHandymanSkillsAsync(int handymanInfoId);
        Task RegisterHandyManAsync(AddHandyInfoDto dto);
        Task<List<HandymanDto>> SearchHandymanAsync(string search, int pageNumber, int pageSize);
        Task<HandymanInfo> UpdateHandymanInfoAsync(AddHandyInfoDto dto, int handymanInfoId, int regionId);
        Task ChangeHandyStatus(int handymanId);
    }
}