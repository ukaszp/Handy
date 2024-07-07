using Handy.Exceptions;
using Handy.Data;
using Handy.Entities;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HandyApi.Services
{
    public class RatingRespondService : IRatingRespondService
    {
        private readonly AppDbContext dbContext;

        public RatingRespondService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task AddRatingRespondAsync(string respondContent, int ratingId)
        {
            var rating = await dbContext
                .Ratings
                .FirstOrDefaultAsync(r => r.Id == ratingId);

            if (rating == null)
                throw new NotFoundException("rating not found");

            var ratingRespond = new RatingRespond
            {
                RatingId = ratingId,
                Content = respondContent
            };

            rating.ratingResponds.Add(ratingRespond);
            await dbContext.SaveChangesAsync();

        }

        public async Task<RatingRespond> GetRatingRespondAsync(int ratingRespondId)
        {
            var ratingRespond = await dbContext
                .RatingResponds
                .FirstOrDefaultAsync(rr => rr.Id == ratingRespondId);

            if (ratingRespond == null)
                throw new NotFoundException("ratingRespond not found");

            return ratingRespond;
        }

        public async Task<string> EditRespondAsync(int respondId, string content)
        {
            var ratingRespond = await GetRatingRespondAsync(respondId);

            ratingRespond.Content = content;

            await dbContext.SaveChangesAsync();

            return ratingRespond.Content;
        }

        public async Task RemoveRespondAsync(int respondId)
        {
            var respond = await GetRatingRespondAsync(respondId);

            dbContext.RatingResponds.Remove(respond);
            await dbContext.SaveChangesAsync();
        }
    }
}
