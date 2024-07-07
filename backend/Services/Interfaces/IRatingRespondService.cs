using Handy.Entities;

namespace Handy.Api.Services.Interfaces
{
    public interface IRatingRespondService
    {
        Task AddRatingRespondAsync(string respondContent, int ratingId);
        Task<string> EditRespondAsync(int respondId, string content);
        Task<RatingRespond> GetRatingRespondAsync(int ratingRespondId);
        Task RemoveRespondAsync(int respondId);
    }
}