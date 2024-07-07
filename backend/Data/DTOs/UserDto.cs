using System.ComponentModel.DataAnnotations;

namespace Handy.Api.Data.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public int RoleId { get; set; }
    }
}
