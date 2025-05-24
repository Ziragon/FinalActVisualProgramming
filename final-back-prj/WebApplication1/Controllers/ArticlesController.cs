using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "3")] // Только для пользователей с ролью User (3)
    public class ArticlesController : ControllerBase
    {
        private readonly ArticleService _articleService;

        public ArticlesController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] ArticleCreateRequest request)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                if (currentUserId != request.AuthorId)
                    return Forbid();

                var article = await _articleService.CreateAsync(request.AuthorId, request.Title, request.Body);
                return Ok(article);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitForReview(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                await _articleService.SubmitForReviewAsync(id, currentUserId);
                return Ok("Статья отправлена на рецензирование");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var articles = await _articleService.GetByStatusAsync(status);
            return Ok(articles);
        }
    }

    public class ArticleCreateRequest
    {
        public int AuthorId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}