using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            try
            {
                bool success = await _userService.RegisterAsync(request.Login, request.Password, request.RoleId);
                return success ? Ok("Пользователь зарегистрирован") : BadRequest("Логин занят");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var user = await _userService.AuthenticateAsync(request.Login, request.Password);
            return user != null ? Ok(user) : Unauthorized("Неверный логин или пароль");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user != null ? Ok(user) : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }

    public class UserRegisterRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
    }

    public class UserLoginRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
    }
}