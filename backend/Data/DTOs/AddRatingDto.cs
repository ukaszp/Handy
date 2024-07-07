namespace HandyApi.Data.DTOs
{
    public class AddRatingDto
    {
        public int OfferId { get; set; }
        public string? ReviewContent { get; set; }
        public int Rate { get; set; }
    }
}