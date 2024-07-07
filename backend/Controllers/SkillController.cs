using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Exceptions;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class SkillController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet("{skillId}")]
    public async Task<IActionResult> GetSkill(int skillId)
    {
        try
        {
            var skill = await _skillService.GetSkill(skillId);
            return Ok(skill);
        }
        catch (NotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetSkills()
    {
        var skills = await _skillService.GetSkills();
        if (skills == null || !skills.Any())
        {
            return NotFound("No skills found.");
        }
        return Ok(skills);
    }

    [HttpPost]
    public async Task<IActionResult> AddSkill([FromBody] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest("Skill name is required.");

        var skill = await _skillService.AddSkill(name);
        return CreatedAtAction(nameof(GetSkill), new { skillId = skill.Id }, skill);
    }

    [HttpDelete("{skillId}")]
    public async Task<IActionResult> RemoveSkill(int skillId)
    {
        try
        {
            await _skillService.RemoveSkill(skillId);
            return NoContent();
        }
        catch (NotFoundException)
        {
            return NotFound($"Skill with ID {skillId} not found.");
        }
    }
}
