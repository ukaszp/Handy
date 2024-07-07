using Handy.Entities;
using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class Rating
    {
        [Key]
        public int Id { get; set; }
        public int Rate { get; set; }
        public string? ReviewContent { get; set; }
        public HandymanInfo Handyman { get; set; }
        public int HandymanId { get; set; }
        public int OfferId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public User User { get; set; }
        public int UserId { get; set; }
        public List<RatingRespond>? ratingResponds { get; set; } = new List<RatingRespond>();
    } 
}
