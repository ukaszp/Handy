using Handy.Data;
using Handy.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Handy.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public IActionResult GetChatHistory(string otherUserId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var messages = _context.ChatMessages
                .Where(m => (m.SenderUserId == currentUserId && m.ReceiverUserId == otherUserId)
                            || (m.SenderUserId == otherUserId && m.ReceiverUserId == currentUserId))
                .OrderBy(m => m.Timestamp)
                .ToList();

            return Ok(messages);
        }
    }

}
