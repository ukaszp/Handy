using Handy.Api.Data.DTOs;
using Handy.Data.Enum;
using Handy.Entities;
using HandyApi.Data.DTOs;

namespace Handy.Api.Services.Interfaces
{
    public interface IOfferService
    {
        Task<OfferStatus> ChangeOfferStatusAsync(int offerId, OfferStatus status);
        Task CreateOfferAsync(CreateOfferDto dto);
        Task DeleteOfferAsync(int offerId);
        Task<Offer> GetOfferAsync(int offerId);
        Task<List<OfferDto>> GetOffersByTaskId(int taskId);
        Task<List<OfferDto>> GetOffersByHandymenId(int handymenId);
        Task AcceptOffer(int offerId);
    }
}