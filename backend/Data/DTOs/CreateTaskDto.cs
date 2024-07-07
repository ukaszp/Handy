using Handy.Api.Entities;

namespace HandyApi.DTOs
{
    public class CreateTaskDto
    {
        public int ClientId { get; set; }
        public int RegionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<int> Skills { get; set; }
        public List<int>? Photos { get; set; }
    }
}