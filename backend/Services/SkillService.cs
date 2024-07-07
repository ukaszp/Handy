using Handy.Exceptions;
using AutoMapper;
using Handy.Data;
using Handy.Entities;
using Microsoft.EntityFrameworkCore;
using Handy.Api.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandyApi.Services
{
    public class SkillService : ISkillService
    {
        private readonly AppDbContext dbContext;

        public SkillService(AppDbContext appDbContext)
        {
            this.dbContext = appDbContext;
        }

        public async Task<List<Skill>> GetSkillsByIds(IEnumerable<int> skillIds)
        {
            return await dbContext.Skills
                                  .Where(d => skillIds.Contains(d.Id))
                                  .ToListAsync();
        }

        public async Task<List<Skill>> GetSkills()
        {
            return await dbContext.Skills.ToListAsync();
        }

        public async Task<Skill> GetSkill(int skillId)
        {
            var skill = await dbContext.Skills
                                       .FirstOrDefaultAsync(d => d.Id == skillId);

            if (skill == null)
                throw new NotFoundException("skill not found");

            return skill;
        }

        public async Task<Skill> AddSkill(string name)
        {
            var skill = new Skill
            {
                Name = name
            };

            dbContext.Skills.Add(skill);
            await dbContext.SaveChangesAsync();
            return skill;
        }

        public async Task<string> EditSkill(int skillId, string name)
        {
            var skill = await GetSkill(skillId);

            skill.Name = name;
            await dbContext.SaveChangesAsync();
            return skill.Name;
        }

        public async Task RemoveSkill(int skillId)
        {
            var skill = await GetSkill(skillId);

            dbContext.Skills.Remove(skill);
            await dbContext.SaveChangesAsync();
        }
    }
}
