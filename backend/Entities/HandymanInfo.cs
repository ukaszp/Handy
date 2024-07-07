using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Handy.Entities
{
    public class HandymanInfo
    {
        [Key]
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public List<Skill>? Skills { get; set; } = new List<Skill>();
        public string? PortoflioURL { get; set; }
        public Region? Region { get; set; }
        public string? Description { get; set; }
        public int? RegionId { get; set; }
        public bool isActive { get; set; } = true;
        public List<Rating>? Ratings { get; set; } = new List<Rating>();
    }
}
