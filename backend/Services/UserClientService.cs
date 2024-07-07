using Handy.Entities;
using Handy.Exceptions;
using Handy.Models;
using Handy.Data;
using Microsoft.Identity.Client;
using System.Text.RegularExpressions;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using Handy.Api.Data.DTOs;

namespace Handy.Services
{
    public class UserClientService : IUserClientService
    {
        private readonly IUserService userService;
        private readonly AppDbContext dbContext;

        public UserClientService(IUserService userService, AppDbContext dbContext)
        {
            this.userService = userService;
            this.dbContext = dbContext;
        }

        public async Task<UserClient> RegisterClientUser(CreateUserDto dto)
        {
            var serviceUser = await userService.CreateUserAsync(dto);
            var newClientUser = new UserClient()
            {
                User = serviceUser,
                UserId = serviceUser.Id,
            };

            await dbContext.AddAsync(newClientUser);
            await dbContext.SaveChangesAsync();

            return newClientUser;
        }

        public async Task<UserClient> DeleteClient(int clientId)
        {
            var clientAccount = await dbContext
                .UserClients
                .FirstOrDefaultAsync(u => u.Id == clientId);

            if (clientAccount == null)
                throw new NotFoundException("clientAccount not found");

            dbContext.Remove(clientAccount);

            await dbContext.SaveChangesAsync();

            return clientAccount;
        }

        public async Task<User> GetUserAccountInfo(int userClientId)
        {
            var userClient = await dbContext
                .UserClients
                .Include(uc => uc.User)
                .FirstOrDefaultAsync(u => u.Id == userClientId);

            if (userClient == null || userClient.User == null)
                throw new NotFoundException("User or UserClient not found");

            return userClient.User;
        }

        public async Task<List<UserTaskDto>> GetUserTasks(int clientId)
        {
            var tasks = await dbContext
                .Tasks
                .Include(t => t.Region)
                .Include(t=>t.AcceptedOffer)
                .Where(t=>t.ClientId == clientId)
                .Select(t => new UserTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    CreationDate = t.CreationDate,
                    CompletionDate = t.CompletionDate,
                    IsActive = t.IsActive,
                    User = t.Client.User,
                    Region = t.Region,
                    FinishedClient = t.FinishedClient,
                    FinishedHandyman = t.FinishedHandyman,
                    AcceptedOfferId = t.AcceptedOfferId,
                    Skills = t.Skills.Select(s => new SkillDto
                    {
                        Id = s.Id,
                        Name = s.Name
                    }).ToList(),
                    Photos = t.Photos.Select(p => new PhotoDto
                    {
                        Id = p.Id,
                        Url = p.Url
                    }).ToList()
                })
                .ToListAsync();

            return tasks;
        }
    }
}
