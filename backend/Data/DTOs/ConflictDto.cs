using Handy.Data.Enum;
using Handy.Entities;

namespace Handy.Api.Data.DTOs
{
    public class ConflictDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public User Client { get; set; }
        public int HandymanId { get; set; }
        public int OfferId { get; set; }
        public Offer Offer { get; set; }
        public string? Description { get; set; }
        public StatusOfTask Status { get; set; }
        public DateTime? Created { get; set; } = DateTime.Now;
        public HandymanInfo Handymen { get; set; }
    }
}
