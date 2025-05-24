using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly ProfileService _profileService;

        public ProfilesController(ProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] ProfileUpdateRequest request)
        {
            try
            {
                await _profileService.UpdateProfileAsync(userId, request.FullName, request.Email);
                return Ok("Профиль обновлён");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _profileService.GetProfileAsync(userId);
            return profile != null ? Ok(profile) : NotFound();
        }
    }

    public class ProfileUpdateRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}