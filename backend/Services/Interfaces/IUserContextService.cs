using System.Security.Claims;

namespace Handy.Api.Services.Interfaces
{
    public interface IUserContextService
    {
        int? GetUserId { get; }
        ClaimsPrincipal? User { get; }
    }
}