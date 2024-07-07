using Handy.Exceptions;
using Handy.Data;
using Handy.Data.Enum;
using Handy.Entities;
using HandyApi.Data.DTOs;
using System.Runtime.InteropServices;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using Handy.Api.Data.DTOs;

namespace Handy.Services
{
    public class OfferService : IOfferService
    {
        private readonly AppDbContext dbContext;

        public OfferService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task CreateOfferAsync(CreateOfferDto dto)
        {
            var task = await dbContext
                .Tasks
                .FirstOrDefaultAsync(t => t.Id == dto.TaskId);

            if (task == null)
                throw new NotFoundException("Task not found");

            var handyman = await dbContext
                .HandymanInfos
                .FirstOrDefaultAsync(t => t.Id == dto.HandymanId);

            if (handyman == null)
                throw new NotFoundException("Handyman not found");

            var offer = new Offer
            {
                Task = task,
                TaskId = dto.TaskId,
                Handyman = handyman,
                HandymanId = dto.HandymanId,
                Price = dto.Price,
                EstimatedTime = dto.EstimatedTime
            };

            task.Offers.Add(offer);

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteOfferAsync(int offerId)
        {
            var offer = await GetOfferAsync(offerId);

            if(offer.Status != OfferStatus.Accepted)
            {
                dbContext.Offers.Remove(offer);
                await dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception("cannot delete accepted offer");
            }
        }

        public async Task<OfferStatus> ChangeOfferStatusAsync(int offerId, OfferStatus status)
        {
            var offer = await GetOfferAsync(offerId);

            offer.Status = status;

            await dbContext.SaveChangesAsync();
            return status;
        }

        public async Task<Offer> GetOfferAsync(int offerId)
        {
            var offer = await dbContext
                .Offers
                .FirstOrDefaultAsync(r => r.Id == offerId);

            if (offer == null)
                throw new NotFoundException("Offer not found");

            return offer;
        }

        public async Task AcceptOffer(int offerId)
        {
            var offer = await dbContext
                .Offers
                .FirstOrDefaultAsync(r => r.Id == offerId);

            if (offer == null)
                throw new NotFoundException("Offer not found");

            offer.Status = OfferStatus.Accepted;

            var task = await dbContext
                .Tasks
                .FirstOrDefaultAsync(t=>t.Id == offer.TaskId);


            if (task == null)
                throw new NotFoundException("task not found");

            task.AcceptedOfferId = offer.Id;
            task.AcceptedOffer = offer;

            task.Status = StatusOfTask.InProgress;
            task.IsActive = false;

            await dbContext.SaveChangesAsync();
        }

        public async Task<List<OfferDto>> GetOffersByTaskId(int taskId)
        {
            var task = await dbContext
                                .Tasks
                                .Include(t => t.Offers)         
                                    .ThenInclude(o => o.Handyman) 
                                        .ThenInclude(h => h.User) 
                                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
                throw new NotFoundException("task not found");
            if (task.Offers == null)
                throw new NotFoundException("no offers found");

             var offerList = task
                .Offers
                .Select(o => new OfferDto
                {
                    Id = o.Id,
                    Task = o.Task != null ? new UserTaskDto
                    {
                        Id = o.Task.Id,
                        Title = o.Task.Title,
                    } : null,
                    TaskId = o.TaskId,
                    Handyman = o.Handyman != null ? new HandymanDto
                    {
                        Id =    o.Handyman.Id,
                        UserId = o.Handyman.UserId,
                        User = o.Handyman.User,
                    } : null,
                    Price = o.Price,
                    EstimatedTime =o.EstimatedTime,
                    Comment = o.comment,
                    Status = o.Status

                }).ToList();

            return offerList;

        }
        public async Task<List<OfferDto>> GetOffersByHandymenId(int handymenId)
        {
            var offers = await dbContext
                                .Offers
                                    .Include(o => o.Handyman)
                                        .ThenInclude(h => h.User)
                                    .Include(o=> o.Task)
                                        .ThenInclude(t=>t.Client)
                                            .ThenInclude(c=>c.User)
                                .Where(o=>o.HandymanId == handymenId)
                                .ToListAsync();

            if (offers == null)
                throw new NotFoundException("task not found");

            var offerList = offers
               .Select(o => new OfferDto
               {
                   Id = o.Id,
                   Task = o.Task != null ? new UserTaskDto
                   {
                       Id = o.Task.Id,
                       Title = o.Task.Title,
                       User = o.Task.Client.User,
                   } : null,
                   TaskId = o.TaskId,
                   Handyman = o.Handyman != null ? new HandymanDto
                   {
                       Id = o.Handyman.Id,
                       UserId = o.Handyman.UserId,
                       User = o.Handyman.User,
                   } : null,
                   Price = o.Price,
                   EstimatedTime = o.EstimatedTime,
                   Comment = o.comment,
                   Status = o.Status

               }).ToList();

            return offerList;

        }
    }
}
