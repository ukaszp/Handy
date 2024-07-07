using Handy.Data;
using Handy.Entities;

namespace Handy
{
    public class AccountSeeder
    {
        private readonly AppDbContext _db;
        public AccountSeeder(AppDbContext db)
        {
                _db = db;
        }
        public void Seed()
        {
            if(_db.Database.CanConnect())
            {
                if(!_db.Roles.Any())
                {
                    var roles = GetRoles();
                    _db.Roles.AddRange(roles);
                    _db.SaveChanges();
                }
            }
        }
        private IEnumerable<Role> GetRoles()
        {
            var roles = new List<Role>()
            {
                new Role()
                {
                    Id = 1,
                    Name="Admin",
                    Description="admin"
                },
                new Role()
                {
                    Id = 2,
                    Name="User",
                    Description = "user"
                },
                new Role()
                {
                    Id = 3,
                    Name="Handyman",
                    Description = "handyman"
                }
            };
            return roles;
        }
    }
}
