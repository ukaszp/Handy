using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class RatingRespond
    {
        [Key]
        public int Id { get; set; }
        public int RatingId { get; set; }
        public string Content { get; set; }

    }
}
