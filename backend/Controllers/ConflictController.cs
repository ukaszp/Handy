using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Data.Enum;
using Handy.Api.Data.DTOs;
using Handy.Exceptions;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class ConflictController : ControllerBase
{
    private readonly IConflictService _conflictService;

    public ConflictController(IConflictService conflictService)
    {
        _conflictService = conflictService;
    }

    [HttpPost]
    public async Task<IActionResult> OpenConflict([FromBody] CreateConflictDTO dto)
    {
        try
        {
            await _conflictService.OpenConflict(dto);
            return Ok("Conflict opened successfully");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{conflictId}/status")]
    public async Task<IActionResult> ChangeStatus(int conflictId, [FromBody] StatusOfTask status)
    {
        try
        {
            await _conflictService.ChangeStatus(status, conflictId);
            return Ok($"Conflict with ID {conflictId} status changed to {status}.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{conflictId}")]
    public async Task<IActionResult> DeleteConflict(int conflictId)
    {
        try
        {
            await _conflictService.DeleteConflict(conflictId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
    [HttpGet("open")]
    public async Task<IActionResult> GetOpenConflictsAscync()
    {
        try
        {
            var conflicts = await _conflictService.GetOpenConflictsAsync();
            return Ok(conflicts);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
    [HttpGet("handymenconflicts/{handymenId}")]
    public async Task<IActionResult> GetHandymenConflictsAscync(int handymenId)
    {
        try
        {
            var conflicts = await _conflictService.GetHandymenConflictsAsync(handymenId);
            return Ok(conflicts);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("userconflicts/{userId}")]
    public async Task<IActionResult> GetUserConflictsAscync(int userId)
    {
        try
        {
            var conflicts = await _conflictService.GetUsernConflictsAsync(userId);
            return Ok(conflicts);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
