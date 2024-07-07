using Handy.Api.Data.DTOs;
using Handy.Data.Enum;
using Handy.Entities;
using HandyApi.DTOs;

namespace Handy.Api.Services.Interfaces
{
    public interface ITaskService
    {
        Task<StatusOfTask> ChangeStatusAsync(int taskId, StatusOfTask status);
        Task<bool> ChangeTaskActivityAsync(int taskId);
        Task<string> ChangeTaskDescriptionAsync(string description, int taskId);
        Task<Region> ChangeTaskRegionAsync(int taskId, int regionId);
        Task CreateTaskAsync(CreateTaskDto dto);
        Task DeleteTaskAsync(int taskId);
        Task<List<UserTaskDto>> GetAllActiveTasksAsync();
        Task<List<UserTaskDto>> GetAllTasksAsync();
        Task<UserTask> GetTaskAsync(int taskId);
        Task<List<Offer>> GetTaskOffersAsync(int taskId);
        Task<List<Skill>> GetTaskSkillsAsync(int taskId);
        Task<Skill> RemoveSkillFromTaskAsync(int taskId, int skillId);
        Task<UserTask> SetTaskToCompleteAsync(int taskId);
        Task FinishHandyman(int taskId);
        Task FinishUser(int taskId);
    }
}