using Handy.Api.Data.DTOs;
using Handy.Api.Entities;
using Handy.Api.Services.Interfaces;
using Handy.Data;
using Handy.Data.Enum;
using Handy.Exceptions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using NSwag.Generation.Processors;
using System.Numerics;

namespace Handy.Api.Services
{
    public class ConflictService : IConflictService
    {
        private readonly AppDbContext dbContext;

        public ConflictService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task OpenConflict(CreateConflictDTO dto)
        {
            var client = await dbContext
                .Users
                .FirstOrDefaultAsync(c => c.Id == dto.ClientId);

            var offer = await dbContext
                .Offers
                .FirstOrDefaultAsync(c => c.Id == dto.OfferId);

            if (client == null)
                throw new NotFoundException("client not found");

            if (offer == null)
                throw new NotFoundException("offer not found");


            var newConflict = new Entities.Conflict()
            {
                Client = client,
                Offer = offer,
                ClientId = dto.ClientId,
                HandymanId = dto.HandymanId,
                OfferId = dto.OfferId,
                Description = dto.Description,
                Status = Handy.Data.Enum.StatusOfTask.Open

            };

            dbContext.Conflicts.Add(newConflict);
            await dbContext.SaveChangesAsync();
        }

        public async Task ChangeStatus(StatusOfTask status, int conflictId)
        {
            var conflict = await dbContext
                .Conflicts
                .FirstOrDefaultAsync(c => c.Id == conflictId);
            if (conflict == null)
                throw new NotFoundException("conflict not found");

            conflict.Status = status;
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteConflict(int conflictId)
        {
            var conflict = await dbContext
                .Conflicts
                .FirstOrDefaultAsync(c => c.Id == conflictId);

            if (conflict == null)
                throw new NotFoundException("conflict not found");

            dbContext.Remove(conflict);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<ConflictDto>> GetOpenConflictsAsync()
        {
            return  await dbContext
                .Conflicts
                .Include(c=>c.Client)
                .Include(c=>c.Offer)
                    .ThenInclude(o=>o.Handyman)
                        .ThenInclude(hm=>hm.User)
                .Where(c => c.Status == StatusOfTask.Open)
                .Select(c=> new ConflictDto {
                    Id = c.Id,
                    ClientId = c.Client.Id,
                    Client = c.Client,
                    HandymanId = c.HandymanId,
                    OfferId = c.OfferId,
                    Offer = c.Offer,
                    Description = c.Description,
                    Status = c.Status,
                    Created = c.Created,
                    Handymen = c.Offer.Handyman
                  
            }).ToListAsync();

        }

        public async Task<List<Entities.Conflict>> GetHandymenConflictsAsync(int handymanId)
        {
            return await dbContext
                .Conflicts
                .Include(c => c.Client)
                .Where(c => c.Status == StatusOfTask.Open)
                .Where(c => c.HandymanId == handymanId)
                .ToListAsync();

        }

        public async Task<List<Entities.Conflict>> GetUsernConflictsAsync(int userId)
        {
            return await dbContext
                .Conflicts
                .Include(c => c.Client)
                .Where(c => c.Status == StatusOfTask.Open)
                .Where(c => c.HandymanId == userId)
                .ToListAsync();

        }
    }
}
