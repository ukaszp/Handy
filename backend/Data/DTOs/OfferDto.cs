using Handy.Data.Enum;
using Handy.Entities;
using System.ComponentModel.DataAnnotations;

namespace Handy.Api.Data.DTOs
{
    public class OfferDto
    {
        public int Id { get; set; }
        public UserTaskDto Task { get; set; }
        public int TaskId { get; set; }
        public HandymanDto Handyman { get; set; }
        public int HandymanId { get; set; }
        public float? Price { get; set; }
        public string? EstimatedTime { get; set; }
        public string? Comment { get; set; }
        public Rating Rating { get; set; }
        public OfferStatus Status { get; set; }
    }
}
