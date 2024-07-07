using Handy.Entities;

namespace HandyApi.DTOs
{
    public class AddHandyInfoDto
    {
        public int UserId { get; set; }
        public string PortfolioUrl { get; set; }
        public string? Description { get; set; }
        public List<int> Skills { get; set; } = new List<int>();
        public int RegionId { get; set; }
    }
}