using Handy.Api.Services.Interfaces;
using Handy.Data;
using Handy.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Handy.Api.Services
{
    public class RegionService : IRegionService
    {
        private readonly AppDbContext dbContext;

        public RegionService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Region> AddRegionAsync(string regionName)
        {
            var newRegion = new Region()
            {
                Name = regionName
            };

            dbContext.Regions.Add(newRegion);
            await dbContext.SaveChangesAsync();
            return newRegion;
        }

        public async Task<List<Region>> GetAllRegionsAsync()
        {
            return await dbContext.Regions.ToListAsync();
        }

        public async Task<Region> GetRegionByIdAsync(int id)
        {
            return await dbContext.Regions.FindAsync(id);
        }

        public async Task<Region> UpdateRegionAsync(int id, string newName)
        {
            var region = await dbContext.Regions.FindAsync(id);
            if (region != null)
            {
                region.Name = newName;
                await dbContext.SaveChangesAsync();
                return region;
            }
            return null;
        }

        public async Task<bool> DeleteRegionAsync(int id)
        {
            var region = await dbContext.Regions.FindAsync(id);
            if (region != null)
            {
                dbContext.Regions.Remove(region);
                await dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
