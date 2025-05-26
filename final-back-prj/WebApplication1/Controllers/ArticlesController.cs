using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly ArticleService _articleService;

        public ArticlesController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        [Authorize(Roles = "3")]
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

        [Authorize(Roles = "3")]
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitForReview(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value);
                await _articleService.SubmitForReviewAsync(id, userId);
                return Ok("Статья отправлена на рецензирование");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{articleId}")]
        public async Task<IActionResult> GetArticleById(int articleId)
        {
            try
            {
                var reviews = await _articleService.GetArticleByIdAsync(articleId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "2")]
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var articles = await _articleService.GetByStatusAsync(status);
            return Ok(articles);
        }

        [Authorize(Roles = "3")]
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

        [Authorize(Roles = "1")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var articles = await _articleService.GetAllAsync();
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "1")]
        [HttpDelete("{articleId}")]
        public async Task<IActionResult> DeleteArticle(int articleId)
        {
            try
            {
                await _articleService.DeleteArticleAsync(articleId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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