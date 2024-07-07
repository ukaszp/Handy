using Handy.Entities;

namespace Handy.Api.Data.DTOs
{
    public class HandymanDto
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public List<SkillDto>? Skills { get; set; } = new List<SkillDto>();
        public string? PortoflioURL { get; set; }
        public Region? Region { get; set; }
        public string? Description { get; set; }
        public int? RegionId { get; set; }
        public bool isActive { get; set; } = true;
        public List<Rating>? Ratings { get; set; } = new List<Rating>();
    }
}
