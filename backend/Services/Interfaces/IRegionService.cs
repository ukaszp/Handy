using Handy.Entities;

namespace Handy.Api.Services.Interfaces
{
    public interface IRegionService
    {
        Task<Region> AddRegionAsync(string regionName);
        Task<bool> DeleteRegionAsync(int id);
        Task<List<Region>> GetAllRegionsAsync();
        Task<Region> GetRegionByIdAsync(int id);
        Task<Region> UpdateRegionAsync(int id, string newName);
    }
}