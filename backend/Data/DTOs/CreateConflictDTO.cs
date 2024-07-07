namespace Handy.Api.Data.DTOs
{
    public class CreateConflictDTO
    {
        public int ClientId { get; set; }
        public int HandymanId { get; set; }
        public int OfferId { get; set; }
        public string? Description { get; set; }
    }
}
