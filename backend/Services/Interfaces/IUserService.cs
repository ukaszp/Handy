using Handy.Entities;
using Handy.Models;

namespace Handy.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task AssignRoleAsync(int roleId, int userId);
        Task<User> CreateUserAsync(CreateUserDto dto);
        Task DeleteUserAsync(int id);
        Task<string> GenerateJwtAsync(LoginDto dto);
        Task<IEnumerable<User>> GetAllAsync();
        Task<IEnumerable<User>> GetAllSearchAsync(string search);
        Task<User> GetByIdAsync(int id);
        Task<User> GetUserLoginAsync(LoginDto dto);
        Task<bool> UpdateUserAsync(int id, UpdateUserDto dto);
        string GetCurrentUserId();
    }
}