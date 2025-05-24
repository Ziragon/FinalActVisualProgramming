using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var uploadedFile = await _fileService.UploadFileAsync(
                    memoryStream.ToArray(), 
                    file.FileName, 
                    file.ContentType
                );
                return Ok(uploadedFile);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{fileId}/attach/article/{articleId}")]
        public async Task<IActionResult> AttachToArticle(int fileId, int articleId)
        {
            try
            {
                await _fileService.AttachToArticleAsync(fileId, articleId);
                return Ok("Файл прикреплён к статье");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}