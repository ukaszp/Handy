using Handy.Exceptions;
using Handy.Data;
using Handy.Entities;
using HandyApi.Data.DTOs;
using System;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Handy.Services
{
    public class RatingService : IRatingService
    {
        private readonly AppDbContext dbContext;
        private readonly IOfferService offerService;

        public RatingService(AppDbContext dbContext, IOfferService offerService)
        {
            this.dbContext = dbContext;
            this.offerService = offerService;
        }

        public async Task AddRatingAsync(AddRatingDto dto)
        {
            var offer = await dbContext
                                .Offers
                                .Include(o => o.Handyman)
                                    .ThenInclude(h => h.Ratings)
                                .Include(o => o.Task)
                                    .ThenInclude(t => t.Client)
                                        .ThenInclude(c => c.User)
                                .FirstOrDefaultAsync(o => o.Id == dto.OfferId);

            if (offer == null)
                throw new NotFoundException("offer not found");

            if (offer.Handyman == null)
                throw new NotFoundException("Handyman not found");

            var newRating = new Rating
            {
                User = offer.Task.Client.User,
                UserId = offer.Task.Client.User.Id,
                Rate = dto.Rate,
                ReviewContent = dto.ReviewContent,
                Handyman = offer.Handyman,
                HandymanId = offer.HandymanId,
                OfferId = offer.Id
            };

            offer.Handyman.Ratings.Add(newRating);
            await dbContext.SaveChangesAsync();
        }

        public async Task<Rating> GetRatingAsync(int ratingId)
        {
            var rating = await dbContext
                .Ratings
                .FirstOrDefaultAsync(o => o.Id == ratingId);

            if (rating == null)
                throw new NotFoundException("rating not found");

            return rating;
        }

        public async Task<bool> DeleteRatingAsync(int ratingId)
        {
            var rating = await GetRatingAsync(ratingId);
            dbContext.Remove(rating);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<RatingRespond>> GetRatingRespondsAsync(int ratingId)
        {
            var rating = await dbContext
                .Ratings
                .Include(r => r.ratingResponds)
                .FirstOrDefaultAsync(o => o.Id == ratingId);

            if (rating == null)
                throw new NotFoundException("rating not found");

            if (rating.ratingResponds == null)
                throw new NotFoundException("rating.ratingResponds not found");

            return rating.ratingResponds.ToList();
        }
    }
}
