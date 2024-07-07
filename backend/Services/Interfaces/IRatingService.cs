using Handy.Entities;
using HandyApi.Data.DTOs;

namespace Handy.Api.Services.Interfaces
{
    public interface IRatingService
    {
        Task AddRatingAsync(AddRatingDto dto);
        Task<bool> DeleteRatingAsync(int ratingId);
        Task<Rating> GetRatingAsync(int ratingId);
        Task<List<RatingRespond>> GetRatingRespondsAsync(int ratingId);
    }
}