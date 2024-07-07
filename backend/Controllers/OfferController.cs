using Microsoft.AspNetCore.Mvc;
using HandyApi.Data.DTOs;
using Handy.Api.Services.Interfaces;
using Handy.Data.Enum;
using Handy.Entities;
using Handy.Exceptions;
using System.Threading.Tasks;
using Handy.Api.Data.DTOs;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class OfferController : ControllerBase
{
    private readonly IOfferService _offerService;

    public OfferController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOffer([FromBody] CreateOfferDto createOfferDto)
    {
        try
        {
            await _offerService.CreateOfferAsync(createOfferDto);
            return Ok("Offer created successfully.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{offerId}")]
    public async Task<IActionResult> DeleteOffer(int offerId)
    {
        try
        {
            await _offerService.DeleteOfferAsync(offerId);
            return Ok($"Offer with ID {offerId} has been deleted.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{offerId}/status")]
    public async Task<IActionResult> ChangeOfferStatus(int offerId, [FromBody] OfferStatus status)
    {
        try
        {
            var updatedStatus = await _offerService.ChangeOfferStatusAsync(offerId, status);
            return Ok($"Offer status updated to {updatedStatus}.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{offerId}")]
    public async Task<IActionResult> GetOffer(int offerId)
    {
        try
        {
            var offer = await _offerService.GetOfferAsync(offerId);
            return Ok(offer);
        }
        catch (NotFoundException)
        {
            return NotFound("Offer not found.");
        }
    }

    [HttpGet("getbytaskid/{taskId}")]
    public async Task<List<OfferDto>> GetTaskOffersById(int taskId)
    {
        return await _offerService.GetOffersByTaskId(taskId);
    }

    [HttpGet("getbyhandymenid/{handymenId}")]
    public async Task<List<OfferDto>> GetTaskOffersByHandymenId(int handymenId)
    {
        return await _offerService.GetOffersByHandymenId(handymenId);
    }

    [HttpPut("accept/{offerId}")]
    public async Task<IActionResult> AcceptOffer(int offerId)
    {
        try
        {
             await _offerService.AcceptOffer(offerId);
            return Ok();
        }
        catch (NotFoundException)
        {
            return NotFound("Offer not found.");
        }
    }

}
