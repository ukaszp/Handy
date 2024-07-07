using Microsoft.AspNetCore.Routing.Constraints;

namespace HandyApi.Data.DTOs
{
    public class CreateOfferDto
    {
        public float Price { get; set; }
        public string EstimatedTime { get; set; }
        public string Comment { get; set; }
        public int TaskId { get; set; }
        public int HandymanId { get; set; }
    }
}