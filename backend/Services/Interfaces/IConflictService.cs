using Handy.Api.Data.DTOs;
using Handy.Data.Enum;

namespace Handy.Api.Services.Interfaces
{
    public interface IConflictService
    {
        Task ChangeStatus(StatusOfTask status, int conflictId);
        Task DeleteConflict(int conflictId);
        Task OpenConflict(CreateConflictDTO dto);
        Task<List<ConflictDto>> GetOpenConflictsAsync();
        Task<List<Entities.Conflict>> GetHandymenConflictsAsync(int handymanId);
        Task<List<Entities.Conflict>> GetUsernConflictsAsync(int userId);
    }
}