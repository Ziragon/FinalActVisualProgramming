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
        private readonly AuthService _authService;

        public UsersController(UserService userService, AuthService authService)
        {
            _userService = userService;
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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user != null ? Ok(user) : NotFound();
        }

        [Authorize(Roles = "1")] // Только для администраторов (RoleId = 1)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            // Получаем ID текущего пользователя из claims
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _userService.GetByIdAsync(userId);

            return user != null ? Ok(user) : NotFound();
        }
    }

    public class UserRegisterRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; } = 2; // По умолчанию роль "User"
    }

    public class UserLoginRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}