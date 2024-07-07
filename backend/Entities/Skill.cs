using System.ComponentModel.DataAnnotations;

namespace Handy.Entities
{
    public class Skill
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public List<HandymanInfo>? HandymanInfos { get; set; } = new List<HandymanInfo>();
        public List<UserTask>? UserTasks { get; set; } = new List<UserTask>();

    }
}
