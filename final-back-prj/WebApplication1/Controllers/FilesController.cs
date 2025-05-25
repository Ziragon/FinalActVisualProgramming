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
    public class FilesController : ControllerBase
    {
        private readonly FileService _fileService;

        public FilesController(FileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var uploadedFile = await _fileService.UploadFileAsync(
                    memoryStream.ToArray(),
                    file.FileName,
                    file.ContentType,
                    currentUserId
                );
                return Ok(uploadedFile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{fileId}/attach/article/{articleId}")]
        public async Task<IActionResult> AttachToArticle(int fileId, int articleId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                await _fileService.AttachToArticleAsync(fileId, articleId, currentUserId);
                return Ok(new { Message = "Файл прикреплён к статье" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{fileId}/attach/profile")]
        public async Task<IActionResult> AttachToProfile(int fileId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                await _fileService.AttachToProfileAsync(fileId, currentUserId);
                return Ok(new { Message = "Файл прикреплён к профилю" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}