using AutoMapper;
using Handy.Api.Services.Interfaces;
using Handy.Entities;
using Handy.Exceptions;
using Handy.Models;
using Handy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Handy.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService userService;

        public AccountController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllSearch([FromQuery] string search)
        {
            var users = await userService.GetAllSearchAsync(search);
            return Ok(users);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {

            var users = await userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost("register")]
        public async Task<ActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            var user = await userService.CreateUserAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                string token = await userService.GenerateJwtAsync(dto);
                User user = await userService.GetUserLoginAsync(dto);
                var result = new
                {
                    Token = token,
                    User = user
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<User>> Get([FromRoute] int id)
        {
            var user = await userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromRoute] int id, [FromBody] UpdateUserDto user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                bool isUpdated = await userService.UpdateUserAsync(id, user);
                return isUpdated ? Ok() : NotFound();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            try
            {
                await userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut("assignrole/{roleid}/{userid}")]
        [Authorize]
        public async Task<ActionResult> AssignRole([FromRoute] int roleid, [FromRoute] int userid)
        {
            try
            {
                await userService.AssignRoleAsync(roleid, userid);
                return Ok();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
