using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Handy.Api.Entities;
using Handy.Data;
using Microsoft.AspNetCore.Authorization;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoService _photoService;

        public PhotosController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is missing or empty.");
            }

            try
            {
                var fileName = System.Net.Http.Headers.ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                using (var stream = file.OpenReadStream())
                {
                    var photo = await _photoService.UploadFileAsync(stream, fileName);
                    if (photo != null)
                    {
                        return Ok(photo);
                    }
                    else
                    {
                        return BadRequest("Failed to upload photo.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(int photoId)
        {
            var result = await _photoService.DeletePhotoAsync(photoId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NotFound("Photo not found.");
            }
        }
    }
}
