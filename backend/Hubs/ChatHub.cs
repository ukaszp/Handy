using Handy.Api.Data;
using Handy.Api.Entities;
using Handy.Api.Services.Interfaces;
using Handy.Data;
using Handy.Entities;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;


namespace Handy.Api.Hubs
{
    [HubName("ChatHub")]
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;
        private readonly IUserService userService;
        private static ConcurrentDictionary<string, List<string>> _connections = new ConcurrentDictionary<string, List<string>>();
        public ChatHub(AppDbContext context, IUserService userService)

        {
            _context = context;
            this.userService = userService;
        }

        public override Task OnConnectedAsync()
        {
            string userId = userService.GetCurrentUserId();
            _connections.AddOrUpdate(userId, new List<string> { Context.ConnectionId },
                                     (key, oldValue) => { oldValue.Add(Context.ConnectionId); return oldValue; });
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string userId = userService.GetCurrentUserId();
            if (_connections.ContainsKey(userId))
            {
                _connections[userId].Remove(Context.ConnectionId);
                if (!_connections[userId].Any())
                {
                    _connections.TryRemove(userId, out var _);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string recipientId, string message)
        {
            var chatMessage = new ChatMessage
            {
                SenderUserId = userService.GetCurrentUserId(),
                ReceiverUserId = recipientId,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            if (_connections.TryGetValue(recipientId, out List<string> connections))
            {
                foreach (string connId in connections)
                {
                    await Clients.Client(connId).SendAsync("ReceiveMessage", userService.GetByIdAsync(int.Parse(userService.GetCurrentUserId())), message);
                }
            }
        }
        public async Task SendMessageToUser(string recipientId, string message)
        {
            var chatMessage = new ChatMessage
            {
                SenderUserId = userService.GetCurrentUserId(),
                ReceiverUserId = recipientId,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            if (_connections.TryGetValue(recipientId, out List<string> recipientConnections))
            {
                foreach (var connectionId in recipientConnections)
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveMessage", userService.GetCurrentUserId(), message);
                }
            }
        }

    }
}
