using Handy.Api.Data.DTOs;
using Handy.Entities;
using Handy.Models;

namespace Handy.Api.Services.Interfaces
{
    public interface IUserClientService
    {
        Task<UserClient> DeleteClient(int clientId);
        Task<User> GetUserAccountInfo(int userClientId);
        Task<List<UserTaskDto>> GetUserTasks(int clientId);
        Task<UserClient> RegisterClientUser(CreateUserDto dto);
    }
}