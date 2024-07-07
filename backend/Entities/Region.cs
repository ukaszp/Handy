using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class Region
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public List<HandymanInfo>? Handymaninfos { get; set; } = new List<HandymanInfo>();
        public List<UserTask>? Tasks { get; set; } = new List<UserTask>();
    }
}
