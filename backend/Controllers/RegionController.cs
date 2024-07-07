using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Handy.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionsController : ControllerBase
    {
        private readonly IRegionService _regionService;

        public RegionsController(IRegionService regionService)
        {
            _regionService = regionService;
        }

        [HttpPost]
        public async Task<IActionResult> AddRegion([FromBody] string regionName)
        {
            if (string.IsNullOrWhiteSpace(regionName))
                return BadRequest("Region name is required.");

            var createdRegion = await _regionService.AddRegionAsync(regionName);
            return CreatedAtAction(nameof(GetRegionById), new { id = createdRegion.Id }, createdRegion);
        }

        [HttpGet]
        public async Task<ActionResult<List<Region>>> GetAllRegions()
        {
            var regions = await _regionService.GetAllRegionsAsync();
            return Ok(regions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Region>> GetRegionById(int id)
        {
            var region = await _regionService.GetRegionByIdAsync(id);

            if (region == null)
                return NotFound();

            return region;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRegion(int id, [FromBody] string newName)
        {
            if (string.IsNullOrWhiteSpace(newName))
                return BadRequest("New region name is required.");

            var updatedRegion = await _regionService.UpdateRegionAsync(id, newName);

            if (updatedRegion == null)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegion(int id)
        {
            var success = await _regionService.DeleteRegionAsync(id);

            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
