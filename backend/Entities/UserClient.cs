using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class UserClient
    {
        [Key]
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public List<UserTask>? Tasks { get; set; } = new List<UserTask>();
    }
}
