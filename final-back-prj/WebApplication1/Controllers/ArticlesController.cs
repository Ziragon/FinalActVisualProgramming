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
                var article = await _articleService.CreateAsync(request.AuthorId, request.Name, request.Category, request.Body, request.Body_Id, request.Tags, request.Status);
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
                var userId = int.Parse(User.FindFirst(AuthService.UserIdClaimType)?.Value);
                await _articleService.SubmitForReviewAsync(id, userId);
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

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetArticlesByUser(int userId)
        {
            try
            {
                var articles = await _articleService.GetArticlesByUserIdAsync(userId);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetById(int userId)
        {
            try
            {
                var articles = await _articleService.GetByIdAsync(userId);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

    public class ArticleCreateRequest
    {
        public int AuthorId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Body { get; set; }
        public int? Body_Id { get; set; }
        public string Tags { get; set; }
        public string Status { get; set; }
    }
}