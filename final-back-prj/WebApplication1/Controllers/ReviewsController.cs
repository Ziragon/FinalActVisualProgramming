using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "2")] // Только для рецензентов с ролью Reviewer (2)
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateRequest request)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                if (currentUserId != request.ReviewerId)
                    return Forbid();

                var review = await _reviewService.CreateReviewAsync(request.ArticleId, request.ReviewerId, request.Comments);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteReview(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                await _reviewService.CompleteReviewAsync(id, currentUserId);
                return Ok("Рецензия завершена");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ReviewCreateRequest
    {
        public int ArticleId { get; set; }
        public int ReviewerId { get; set; }
        public string Comments { get; set; }
    }
}