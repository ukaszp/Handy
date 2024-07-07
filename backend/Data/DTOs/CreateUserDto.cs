using System.ComponentModel.DataAnnotations;

namespace Handy.Models
{
    public class CreateUserDto
    {
        public CreateUserDto()
        {
            DateOfBirth = new DateTime(1900, 1, 1);
        }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string? ContactNumber { get; set; }
        public bool? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; } 
        public int RoleId { get; set; } = 2;
    }
}

