using Handy.Api.Entities;
using Handy.Data.Enum;
using Handy.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Handy.Entities
{
    public class UserTask
    {
        [Key]
        public int Id { get; set; }
        public UserClient Client { get; set; }
        public int ClientId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public Region? Region { get; set; }
        public int? RegionId { get; set; }
        public StatusOfTask Status { get; set; } = StatusOfTask.Open;
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime? CompletionDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool FinishedClient { get; set; } = false;
        public bool FinishedHandyman { get; set; } = false;
        public Offer? AcceptedOffer { get; set; }
        public int? AcceptedOfferId { get; set; }

        public List<Skill>? Skills { get; set; } = new List<Skill>();
        public List<Offer>? Offers { get; set; } = new List<Offer>();
        public List<Photo>? Photos { get; set; } = new List<Photo>();

    }
}
