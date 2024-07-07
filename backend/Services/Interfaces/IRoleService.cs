using Handy.Entities;

namespace Handy.Api.Services.Interfaces
{
    public interface IRoleService
    {
        int CreateRole(Role role);
        void DeleteRole(int id);
        IEnumerable<Role> GetAll();
        Role GetById(int id);
        void UpdateRole(int id, Role role);
    }
}