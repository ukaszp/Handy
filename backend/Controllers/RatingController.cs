using Microsoft.AspNetCore.Mvc;
using HandyApi.Data.DTOs;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Exceptions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpPost]
    public async Task<IActionResult> AddRating([FromBody] AddRatingDto dto)
    {
        try
        {
            await _ratingService.AddRatingAsync(dto);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{ratingId}")]
    public async Task<IActionResult> GetRating(int ratingId)
    {
        try
        {
            var rating = await _ratingService.GetRatingAsync(ratingId);
            if (rating == null)
            {
                return NotFound();
            }
            return Ok(rating);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{ratingId}")]
    public async Task<IActionResult> DeleteRating(int ratingId)
    {
        try
        {
            bool result = await _ratingService.DeleteRatingAsync(ratingId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{ratingId}/responds")]
    public async Task<IActionResult> GetRatingResponds(int ratingId)
    {
        try
        {
            var responds = await _ratingService.GetRatingRespondsAsync(ratingId);
            if (responds == null || responds.Count == 0)
            {
                return NotFound("No responds found for this rating.");
            }
            return Ok(responds);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

}
