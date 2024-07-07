using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Models;
using Handy.Exceptions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class UserClientController : ControllerBase
{
    private readonly IUserClientService _userClientService;

    public UserClientController(IUserClientService userClientService)
    {
        _userClientService = userClientService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterClientUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var userClient = await _userClientService.RegisterClientUser(dto);
            return CreatedAtAction(nameof(GetUserAccountInfo), new { userClientId = userClient.Id }, userClient);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{clientId}")]
    public async Task<IActionResult> DeleteClient(int clientId)
    {
        try
        {
            await _userClientService.DeleteClient(clientId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{userClientId}/account")]
    public async Task<IActionResult> GetUserAccountInfo(int userClientId)
    {
        try
        {
            var userAccount = await _userClientService.GetUserAccountInfo(userClientId);
            return Ok(userAccount);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{clientId}/tasks")]
    public async Task<IActionResult> GetUserTasks(int clientId)
    {
        try
        {
            var tasks = await _userClientService.GetUserTasks(clientId);
            if (tasks == null || tasks.Count == 0)
            {
                return NotFound("No tasks found for this client.");
            }
            return Ok(tasks);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
