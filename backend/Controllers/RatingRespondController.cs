using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Exceptions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class RatingRespondController : ControllerBase
{
    private readonly IRatingRespondService _ratingRespondService;

    public RatingRespondController(IRatingRespondService ratingRespondService)
    {
        _ratingRespondService = ratingRespondService;
    }

    [HttpPost]
    public async Task<IActionResult> AddRatingRespond([FromBody] string respondContent, int ratingId)
    {
        try
        {
            await _ratingRespondService.AddRatingRespondAsync(respondContent, ratingId);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{ratingRespondId}")]
    public async Task<IActionResult> GetRatingRespond(int ratingRespondId)
    {
        try
        {
            var ratingRespond = await _ratingRespondService.GetRatingRespondAsync(ratingRespondId);
            return Ok(ratingRespond);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{respondId}")]
    public async Task<IActionResult> EditRespond(int respondId, [FromBody] string content)
    {
        try
        {
            var updatedContent = await _ratingRespondService.EditRespondAsync(respondId, content);
            return Ok(updatedContent);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{respondId}")]
    public async Task<IActionResult> RemoveRespond(int respondId)
    {
        try
        {
            await _ratingRespondService.RemoveRespondAsync(respondId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
