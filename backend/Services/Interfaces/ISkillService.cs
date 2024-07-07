using Handy.Entities;

namespace Handy.Api.Services.Interfaces
{
    public interface ISkillService
    {
        Task<Skill> AddSkill(string name);
        Task<string> EditSkill(int skillId, string name);
        Task<Skill> GetSkill(int skillId);
        Task<List<Skill>> GetSkills();
        Task<List<Skill>> GetSkillsByIds(IEnumerable<int> skillIds);
        Task RemoveSkill(int skillId);
    }
}