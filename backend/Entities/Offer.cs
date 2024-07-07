using Handy.Entities;
using Handy.Data.Enum;
using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class Offer
    {
        [Key]
        public int Id { get; set; }
        public UserTask Task { get; set; }
        public int TaskId { get; set; }
        public HandymanInfo Handyman { get; set; }
        public int HandymanId { get; set; }
        public float? Price { get; set; }
        public string? EstimatedTime {  get; set; }
        public string? comment { get; set; }
        public OfferStatus Status { get; set; } = OfferStatus.Pending;
    }
}
