using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ProfileService _profileService;
        private readonly AuthService _authService;

        public UsersController(UserService userService, ProfileService profileService, AuthService authService)
        {
            _userService = userService;
            _profileService = profileService;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            try
            {
                bool success = await _authService.RegisterAsync(request.Login, request.Password, request.RoleId);
                return success ? Ok(new { Message = "Пользователь успешно зарегистрирован" })
                              : BadRequest(new { Message = "Логин уже занят" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var token = await _authService.AuthenticateAsync(request.Login, request.Password);

            if (token == null)
                return Unauthorized(new { Message = "Неверный логин или пароль" });

            return Ok(new { Token = token });
        }

        [Authorize(Roles = "1")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user != null ? Ok(user) : NotFound();
        }

        [Authorize(Roles = "1")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var profile = await _userService.GetAllUsersAsync();
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value);
            var user = await _userService.GetByIdAsync(userId);

            return user != null ? Ok(user) : NotFound();
        }

        [Authorize(Roles = "1")]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                if (currentUserId == userId)
                {
                    return BadRequest("Невозможно удалить самого себя");
                }
                await _profileService.DeleteProfileAsync(userId);
                await _userService.DeleteUserAsync(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "1")]
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UserUpdateRequest request)
        {
            try
            {
                await _userService.UpdateUserAsync(userId, request.Login, request.RoleId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class UserRegisterRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; } = 3;
    }

    public class UserLoginRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class UserUpdateRequest
    {
        public string Login { get; set; }
        public int RoleId { get; set; }
    }
}