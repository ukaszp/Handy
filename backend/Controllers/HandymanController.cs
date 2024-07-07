using Microsoft.AspNetCore.Mvc;
using HandyApi.DTOs;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Handy.Exceptions;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class HandymanController : ControllerBase
{
    private readonly IHandymanService _handymanService;

    public HandymanController(IHandymanService handymanService)
    {
        _handymanService = handymanService;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterHandyman([FromBody] AddHandyInfoDto dto)
    {
        try
        {
            await _handymanService.RegisterHandyManAsync(dto);
            return Ok("Handyman registered successfully");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{handymanInfoId}")]
    public async Task<IActionResult> DeleteHandyman(int handymanInfoId)
    {
        try
        {
            var handyman = await _handymanService.DeleteHandymanAsync(handymanInfoId);
            return Ok($"Handyman with ID {handymanInfoId} deleted successfully.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{handymanInfoId}/region/{regionId}")]
    public async Task<IActionResult> UpdateHandymanInfo([FromBody] AddHandyInfoDto addHandyInfoDto, int handymanInfoId, int regionId)
    {
        try
        {
            var updatedHandymanInfo = await _handymanService.UpdateHandymanInfoAsync(addHandyInfoDto, handymanInfoId, regionId);
            return Ok(updatedHandymanInfo);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("{handymanInfoId}/skills")]
    public async Task<IActionResult> AddHandymanSkills([FromBody] List<int> skillIds, int handymanInfoId)
    {
        try
        {
            var skills = await _handymanService.AddHandymanSkillsAsync(skillIds, handymanInfoId);
            return Ok(skills);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{handymanInfoId}")]
    public async Task<IActionResult> GetHandyman(int handymanInfoId)
    {
        try
        {
            var handymanInfo = await _handymanService.GetHandymanAsync(handymanInfoId);
            return Ok(handymanInfo);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("getuser/{userid}")]
    public async Task<IActionResult> GetHandymanByUserId(int userid)
    {
        try
        {
            var handymanInfo = await _handymanService.GetHandymanByUserIdAsync(userid);
            return Ok(handymanInfo);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHandymanInfos()
    {
        var allHandymen = await _handymanService.GetAllHandymanInfosAsync();
        return Ok(allHandymen);
    }

    [HttpGet("{handymanInfoId}/skills")]
    public async Task<IActionResult> GetHandymanSkills(int handymanInfoId)
    {
        try
        {
            var skills = await _handymanService.GetHandymanSkillsAsync(handymanInfoId);
            return Ok(skills);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{handymanInfoId}/ratings")]
    public async Task<IActionResult> GetHandymanRatings(int handymanInfoId)
    {
        try
        {
            var ratings = await _handymanService.GetHandymanRatingsAsync(handymanInfoId);
            return Ok(ratings);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchHandymen(
            [FromQuery] string search = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
    {
        try
        {
            var handymen = await _handymanService.SearchHandymanAsync(search, pageNumber, pageSize);
            if (handymen == null || handymen.Count == 0)
                return NotFound("No handymen found matching the search criteria.");

            return Ok(handymen);
        }
        catch (System.Exception ex)
        {
            return BadRequest($"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllActive(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
    {
        try
        {
            var handymen = await _handymanService.GetAllActiveHandymanAsync(pageNumber, pageSize);
            return Ok(handymen);
        }
        catch (System.Exception ex)
        {
            return BadRequest($"An error occurred: {ex.Message}");
        }
    }

    [HttpPut("status/{handyId}")]
    public async Task<IActionResult> ChangeHandyStatus(int handyId)
    {
        try
        {
            await _handymanService.ChangeHandyStatus(handyId);
            return Ok();
        }
        catch (System.Exception ex)
        {
            return BadRequest($"An error occurred: {ex.Message}");
        }
    }
}
