using Handy.Exceptions;
using Handy.Data;
using Handy.Data.Enum;
using Handy.Entities;
using HandyApi.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Handy.Api.Services.Interfaces;
using Handy.Api.Data.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Threading.Tasks;

namespace Handy.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext dbContext;
        private readonly ISkillService skillService;
        private readonly IPhotoService photoService;

        public TaskService(AppDbContext dbContext, ISkillService skillService, IPhotoService photoService)
        {
            this.dbContext = dbContext;
            this.skillService = skillService;
            this.photoService = photoService;
        }

        public async Task CreateTaskAsync(CreateTaskDto dto)
        {
            var client = await dbContext
               .UserClients
               .FirstOrDefaultAsync(u => u.Id == dto.ClientId);

            if (client == null)
                throw new NotFoundException("client not found");

            var region = await dbContext
               .Regions
               .FirstOrDefaultAsync(u => u.Id == dto.RegionId);

            if (region == null)
                throw new NotFoundException("region not found");

            var newTask = new UserTask()
            {
                Client = client,
                ClientId = dto.ClientId,
                Description = dto.Description,
                Region = region,
                RegionId = dto.RegionId,
                Skills = await skillService.GetSkillsByIds(dto.Skills),
                Photos = await photoService.GetPhotosByIdsAsync(dto.Photos),
                Title = dto.Title
            };

            dbContext.Add(newTask);
            region.Tasks.Add(newTask);
            client.Tasks.Add(newTask);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteTaskAsync(int taskId)
        {
            var task = await dbContext
                .Tasks
                .Include(t=>t.Offers)
                .FirstOrDefaultAsync(t=>t.Id == taskId);

            if (task == null)
                throw new NotFoundException("task not found");

            if(task.Offers != null)
                 dbContext.RemoveRange(task.Offers);
            if (task.Photos != null)
                dbContext.RemoveRange(task.Photos);

            dbContext.Remove(task);

            await dbContext.SaveChangesAsync();

        }

        public async Task<UserTask> GetTaskAsync(int taskId)
        {
            var task = await dbContext.Tasks.FirstOrDefaultAsync(u => u.Id == taskId);


            if (task == null)
                throw new NotFoundException("task not found");

            return task;
        }

        public async Task<List<UserTaskDto>> GetAllActiveTasksAsync()
        {
            return await dbContext
                .Tasks
                .Include(t=>t.Region)
                .Where(t => t.IsActive)
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
        }

        public async Task<List<UserTaskDto>> GetAllTasksAsync()
        {
            return await dbContext
                .Tasks
                .Include(t => t.Region)
                .Select(t => new UserTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Region = t.Region,
                    Description = t.Description,
                    Status = t.Status,
                    CreationDate = t.CreationDate,
                    CompletionDate = t.CompletionDate,
                    IsActive = t.IsActive,
                    User = t.Client.User,
                    FinishedClient = t.FinishedClient,
                    FinishedHandyman = t.FinishedHandyman,
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
        }

        public async Task<List<Offer>> GetTaskOffersAsync(int taskId)
        {
            var task = await dbContext
               .Tasks
               .Include(t => t.Offers)
               .FirstOrDefaultAsync(u => u.Id == taskId);

            if (task == null)
                throw new NotFoundException("task not found");

            return task.Offers;
        }

        public async Task<List<Skill>> GetTaskSkillsAsync(int taskId)
        {
            var task = await dbContext
              .Tasks
              .Include(t => t.Skills)
              .FirstOrDefaultAsync(u => u.Id == taskId);

            if (task == null)
                throw new NotFoundException("task not found");

            return task.Skills;
        }

        public async Task<StatusOfTask> ChangeStatusAsync(int taskId, StatusOfTask status)
        {
            var task = await GetTaskAsync(taskId);

            task.Status = status;
            await dbContext.SaveChangesAsync();

            return status;
        }

        public async Task<bool> ChangeTaskActivityAsync(int taskId)
        {
            var task = await GetTaskAsync(taskId);

            task.IsActive = !task.IsActive;
            await dbContext.SaveChangesAsync();

            return task.IsActive;
        }

        public async Task<UserTask> SetTaskToCompleteAsync(int taskId)
        {
            var task = await GetTaskAsync(taskId);

            task.CompletionDate = DateTime.Now;
            task.IsActive = false;
            task.Status = StatusOfTask.Closed;
            await dbContext.SaveChangesAsync();

            return task;
        }

        public async Task<string> ChangeTaskDescriptionAsync(string description, int taskId)
        {
            var task = await GetTaskAsync(taskId);
            task.Description = description;

            await dbContext.SaveChangesAsync();

            return description;
        }

        public async Task<Region> ChangeTaskRegionAsync(int taskId, int regionId)
        {
            var task = await GetTaskAsync(taskId);

            var region = await dbContext
                .Regions
                .FirstOrDefaultAsync(r => r.Id == regionId);

            if (region == null)
                throw new NotFoundException("region not found");

            task.RegionId = regionId;
            task.Region = region;

            await dbContext.SaveChangesAsync();

            return region;
        }

        public async Task<Skill> RemoveSkillFromTaskAsync(int taskId, int skillId)
        {
            var task = await GetTaskAsync(taskId);

            var skill = await dbContext
                .Skills
                .FirstOrDefaultAsync(r => r.Id == skillId);

            if (skill == null)
                throw new NotFoundException("skill not found");

            task.Skills.Remove(skill);
            await dbContext.SaveChangesAsync();

            return skill;
        }

        public async Task FinishHandyman(int taskId)
        {
            var task = await GetTaskAsync(taskId);

            task.FinishedHandyman = true;

            if (task.FinishedClient == true && task.FinishedHandyman == true)
            {
                task.Status = StatusOfTask.Closed;
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task FinishUser(int taskId)
        {
            var task = await GetTaskAsync(taskId);

            task.FinishedClient = true;

            if (task.FinishedClient == true && task.FinishedHandyman == true)
            {
                task.Status = StatusOfTask.Closed;
            }

            await dbContext.SaveChangesAsync();
        }
    }
}
