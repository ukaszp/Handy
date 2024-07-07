namespace Handy.Models
{
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public bool Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
