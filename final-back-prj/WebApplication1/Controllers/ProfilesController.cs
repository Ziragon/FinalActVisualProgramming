using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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
                await _profileService.UpdateProfileAsync(
                    userId, 
                    request.FullName, 
                    request.Email, 
                    request.Institution, 
                    request.FieldOfExpertise
                );
        
                return Ok(new { Message = "Профиль обновлён" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{userId}/avatar")]
        public async Task<IActionResult> UpdateProfilePic(int userId, [FromBody] ProfilePicRequest request)
        {
            try
            {
                await _profileService.UpdateProfilePicAsync(
                    userId,
                    request.ProfilePicId
                );

                return Ok(new { Message = "Профиль обновлён" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var profile = await _profileService.GetProfilesAsync();
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfileById(int userId)
        {
            try
            {
                var profile = await _profileService.GetByUserIdAsync(userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

    public class ProfileUpdateRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Institution { get; set; }
        public string FieldOfExpertise { get; set; }
    }
    public class ProfilePicRequest
    {
        public int ProfilePicId { get; set; }
    }
}