using Handy.Data.Enum;
using Handy.Entities;

namespace Handy.Api.Data.DTOs
{
    public class UserTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public User User { get; set; }
        public string? Description { get; set; }
        public StatusOfTask Status { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public Region Region { get; set; }
        public bool IsActive { get; set; }
        public bool FinishedClient { get; set; } = false;
        public bool FinishedHandyman { get; set; } = false;
        public OfferDto? AcceptedOffer { get; set; }
        public int? AcceptedOfferId { get; set; }
        public List<SkillDto> Skills { get; set; } = new List<SkillDto>();
        public List<PhotoDto>? Photos { get; set; } = new List<PhotoDto>();
    }
}
