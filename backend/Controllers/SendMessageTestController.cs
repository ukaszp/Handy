namespace Handy.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Handy.Api.Hubs;
    using Microsoft.AspNetCore.SignalR;
    using Handy.Data;

    [Route("api/test")]
    [ApiController]
    public class SendMessageTestController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly AppDbContext dbContext;

        public SendMessageTestController(IHubContext<ChatHub> hubContext, AppDbContext dbContext)
        {
            _hubContext = hubContext;
            this.dbContext = dbContext;
        }

       /* [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageModel model)
        {
            var chatHub = new ChatHub(dbContext);
            await chatHub.SendMessage(model.ReceiverUserId, model.Message);
            return Ok();
        }*/
    }

    public class SendMessageModel
    {
        public string ReceiverUserId { get; set; }
        public string SenderUserId { get; set; }
        public string Message { get; set; }
    }

}
