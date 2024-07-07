using Handy.Api.Services.Interfaces;
using Handy.Data;
using Handy.Entities;
using Handy.Exceptions;

namespace Handy.Services
{
    public class RoleService : IRoleService
    {
        private readonly AppDbContext _dbContext;

        public RoleService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Role GetById(int id)
        {
            var role = _dbContext
                .Roles
                .FirstOrDefault(x => x.Id == id);

            return role == null ? throw new NotFoundException("Role not found") : role;
        }

        public IEnumerable<Role> GetAll()
        {
            var roles = _dbContext
                .Roles
                .ToList();

            return roles;
        }

        public int CreateRole(Role role)
        {
            _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();

            return role.Id;
        }

        public void DeleteRole(int id)
        {
            var role = _dbContext
                .Roles
                .FirstOrDefault(u => u.Id == id);

            if (role is null)
                throw new NotFoundException("Role not found");

            _dbContext.Roles.Remove(role);
            _dbContext.SaveChanges();
        }

        public void UpdateRole(int id, Role role)
        {
            var roledb = _dbContext
              .Roles
              .FirstOrDefault(u => u.Id == id);

            if (role is null)
                throw new NotFoundException("Role not found");

            roledb.Name = role.Name;
            roledb.Description = role.Description;

            _dbContext.SaveChanges();
        }
    }
}

