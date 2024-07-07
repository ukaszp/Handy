using AutoMapper;
using Handy.Entities;
using Handy.Models;

namespace Handy
{
    public class AccountMappingProfile:Profile
    {
        public AccountMappingProfile()
        {
            CreateMap<User, CreateUserDto>();
        }
    }
}
