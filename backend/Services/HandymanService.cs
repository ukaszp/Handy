using Handy.Entities;
using Handy.Exceptions;
using Handy.Models;
using Handy.Data;
using Handy.Entities;
using HandyApi.DTOs;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Handy.Api.Data.DTOs;

namespace Handy.Services
{
    public class HandymanService : IHandymanService
    {

        private readonly IUserService userService;
        private readonly ISkillService skillService;
        private readonly AppDbContext dbContext;
        private readonly IRegionService regionService;

        public HandymanService(IUserService userService, ISkillService skillService, AppDbContext dbContext, IRegionService regionService)
        {
            this.userService = userService;
            this.skillService = skillService;
            this.dbContext = dbContext;
            this.regionService = regionService;
        }

        public async Task RegisterHandyManAsync(AddHandyInfoDto dto)
        {
            var serviceUser = await dbContext
               .Users
               .Include(h => h.Role)
               .FirstOrDefaultAsync(u => u.Id == dto.UserId);

            if (serviceUser == null)
                throw new NotFoundException("Service user not found");

            var handyrole = await dbContext
              .Roles
              .FirstOrDefaultAsync(u => u.Id == 3);

            if (handyrole == null)
                throw new NotFoundException("Role not found");

            if (serviceUser.Role == handyrole)
                throw new NotFoundException("This user is already a handyman");

            serviceUser.RoleId = 3;
            serviceUser.Role = handyrole;

            var newHandyUser = new HandymanInfo()
            {
                User = serviceUser,
                UserId = dto.UserId,
                PortoflioURL = dto.PortfolioUrl,
                Description = dto.Description,
                Skills = await skillService.GetSkillsByIds(dto.Skills),
                RegionId = dto.RegionId,
                Region = await regionService.GetRegionByIdAsync(dto.RegionId)
            };

            dbContext.Add(newHandyUser);
            await dbContext.SaveChangesAsync();
        }

        public async Task<HandymanInfo> DeleteHandymanAsync(int handymanInfoId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .Include(h => h.User)
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");

            dbContext.Remove(handyManInfo);
            dbContext.SaveChanges();

            return handyManInfo;
        }

        public async Task<HandymanInfo> UpdateHandymanInfoAsync(AddHandyInfoDto dto, int handymanInfoId, int regionId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");

            var region = await dbContext
                .Regions
                .FirstOrDefaultAsync(u => u.Id == regionId);

            if (region == null)
                throw new NotFoundException("Region not found");

            handyManInfo.PortoflioURL = dto.PortfolioUrl;
            handyManInfo.Region = region;
            handyManInfo.RegionId = regionId;

            dbContext.SaveChanges();

            return handyManInfo;
        }

        public async Task<List<Skill>> AddHandymanSkillsAsync(List<int> skillids, int handymanInfoId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");

            var skillList = await skillService.GetSkillsByIds(skillids);

            handyManInfo.Skills.AddRange(skillList);

            await dbContext.SaveChangesAsync();

            return skillList;
        }

        public async Task<User> GetHandymanAccountInfoAsync(int handymanInfoId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .Include(h => h.User)
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");

            return handyManInfo.User;
        }

        public async Task<HandymanDto> GetHandymanAsync(int handymanInfoId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .Select(h => new HandymanDto
                {
                    Id = h.Id,
                    User = h.User,
                    UserId = h.UserId,
                    Skills = h.Skills.Select(s => new SkillDto
                    {
                        Id = s.Id,
                        Name = s.Name
                    }).ToList(),
                    Region = h.Region,
                    PortoflioURL = h.PortoflioURL,
                    Description = h.Description
                })
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");
            else
                return handyManInfo;
        }

        public async Task<List<HandymanDto>> GetAllHandymanInfosAsync()
        {
            return await dbContext
                .HandymanInfos
                .Select(h => new HandymanDto
                {
                    Id = h.Id,
                    User = h.User,
                    UserId = h.UserId,
                    Skills = h.Skills.Select(s => new SkillDto
                    {
                        Id = s.Id,
                        Name = s.Name
                    }).ToList(),
                    Region = h.Region,
                    PortoflioURL = h.PortoflioURL,
                    Description = h.Description
                })
                .ToListAsync();
        }

        public async Task<List<Skill>> GetHandymanSkillsAsync(int handymanInfoId)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .Include(h => h.Skills)
                .FirstOrDefaultAsync(u => u.Id == handymanInfoId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");
            else
                return handyManInfo.Skills.ToList();
        }

        public async Task<List<Rating>> GetHandymanRatingsAsync(int handymanInfoId)
        {            

            var ratings = await dbContext
                .Ratings
                .Include(r=>r.ratingResponds)
                .Include(r=>r.User)
                .Where(r => r.HandymanId == handymanInfoId)
                .ToListAsync();

                return ratings;
        }

        public async Task<List<HandymanDto>> SearchHandymanAsync(string search, int pageNumber, int pageSize)
        {
            var query = dbContext.HandymanInfos
                         .Where(h => h.isActive)
                         .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(h => h.User.Name.ToLower().Contains(search.ToLower())
                                         || h.Skills.Any(s => s.Name.ToLower().Contains(search.ToLower()))
                                         || h.Region.Name.ToLower().Contains(search.ToLower())
                                         || h.User.LastName.ToLower().Contains(search.ToLower()));
            }

            return await query.Include(h => h.User)
                              .Include(h => h.Skills)
                              .Include(h => h.Region)
                              .Select(h => new HandymanDto
                              {
                                  Id = h.Id,
                                  User = h.User,
                                  UserId = h.UserId,
                                  Skills = h.Skills.Select(s => new SkillDto
                                  {
                                      Id = s.Id,
                                      Name = s.Name
                                  }).ToList(),
                                  Region = h.Region,
                                  PortoflioURL = h.PortoflioURL,
                                  Description = h.Description
                              })
                              .Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();
        }

        public async Task<HandymanInfo> GetHandymanByUserIdAsync(int userid)
        {
            var handyManInfo = await dbContext
                .HandymanInfos
                .FirstOrDefaultAsync(u => u.UserId == userid);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");
            else
                return handyManInfo;
        }

        public async Task<List<HandymanDto>> GetAllActiveHandymanAsync(int pageNumber, int pageSize)
        {
            var query = dbContext
                .HandymanInfos
                .Where(h => h.isActive)
                .Select(h => new HandymanDto
                {
                    Id = h.Id,
                    User = h.User,
                    UserId = h.UserId,
                    Skills = h.Skills.Select(s => new SkillDto
                    {
                        Id = s.Id,
                        Name = s.Name
                    }).ToList(),
                    Region = h.Region,
                    PortoflioURL = h.PortoflioURL,
                    Description = h.Description
                });

            return await query.Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();
        }

        public async Task ChangeHandyStatus(int handymanId)
        {
            var handyManInfo = await dbContext
              .HandymanInfos
              .Include(h => h.Skills)
              .FirstOrDefaultAsync(u => u.Id == handymanId);

            if (handyManInfo == null)
                throw new NotFoundException("HandyManInfo not found");

            if(handyManInfo.isActive == true)
            {

                handyManInfo.isActive = false;
            }
            else
            {
                handyManInfo.isActive = true;
            }
            await dbContext.SaveChangesAsync();
        }
    }
}
