using Handy.Exceptions;
using AutoMapper;
using Handy.Data;
using Handy.Entities;
using Microsoft.EntityFrameworkCore;
using Handy.Api.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Handy.Models;
using Handy.Authentication;
using Microsoft.AspNetCore.Http;

namespace Handy.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext dbContext;
        private readonly ILogger<UserService> logger;
        private readonly IPasswordHasher passwordHasher;
        private readonly IMapper mapper;
        private readonly AuthenticationSettings authenticationSettings;
        private readonly IUserContextService userContextService;
        private readonly IConfiguration config;
        private readonly IHttpContextAccessor httpContext;
        private readonly SymmetricSecurityKey secretkey;

        public UserService(AppDbContext dbContext, ILogger<UserService> logger, IPasswordHasher passwordHasher, IMapper mapper,
            AuthenticationSettings authenticationSettings, IUserContextService userContextService, IConfiguration config, IHttpContextAccessor httpContext)
        {
            this.dbContext = dbContext;
            this.logger = logger;
            this.passwordHasher = passwordHasher;
            this.mapper = mapper;
            this.authenticationSettings = authenticationSettings;
            this.userContextService = userContextService;
            this.config = config;
            this.httpContext = httpContext;
            secretkey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Authentication:JwtKey"]));
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user ?? throw new NotFoundException("User not found");
        }

        public async Task<IEnumerable<User>> GetAllSearchAsync(string search)
        {
            return await dbContext.Users
                .Where(r => r.LastName.ToLower().Contains(search.ToLower()) || r.Name.ToLower().Contains(search.ToLower()))
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await dbContext.Users.ToListAsync();
        }

        public async Task<User> CreateUserAsync(CreateUserDto dto)
        {
            var passwordHash = passwordHasher.Hash(dto.Password);
            var newUser = new User
            {
                Name = dto.Name,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = passwordHash,
                RoleId = dto.RoleId
            };

            await dbContext.Users.AddAsync(newUser);
            await dbContext.SaveChangesAsync();
            return newUser;
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                throw new NotFoundException("User not found");

            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                throw new NotFoundException("User not found");

            user.Name = dto.Name;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.ContactNumber = dto.ContactNumber;
            user.Gender = dto.Gender;
            user.DateOfBirth = dto.DateOfBirth;

            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task AssignRoleAsync(int roleId, int userId)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var role = await dbContext.Roles.FirstOrDefaultAsync(u => u.Id == roleId);

            if (user == null || role == null)
                throw new NotFoundException("User or Role not found");

            user.RoleId = roleId;
            user.Role = role;
            await dbContext.SaveChangesAsync();
        }

        public async Task<string> GenerateJwtAsync(LoginDto dto)
        {
            var user = await dbContext.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                throw new ExceptionBadRequest("Invalid username or password");

            var result = passwordHasher.Verify(user.PasswordHash, dto.Password);
            if (!result)
                throw new ExceptionBadRequest("Invalid username or password");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.Name} {user.LastName}"),
                new Claim(ClaimTypes.Role, $"{user.Role.Name}"),
            };

            var cred = new SigningCredentials(secretkey, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = cred,
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = config["Authentication:JwtIssuer"],
                Audience = config["Authentication:JwtAudience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<User> GetUserLoginAsync(LoginDto dto)
        {
            var user = await dbContext.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                throw new NotFoundException("User not found");

            return user;
        }

        public string GetCurrentUserId()
        {
            var context = httpContext;
            var userId = httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                return userId;
            }
            throw new Exception("User not found");
        }
    }
}
