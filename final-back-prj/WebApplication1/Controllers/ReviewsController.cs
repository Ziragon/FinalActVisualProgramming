using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                var review = await _reviewService.CreateReviewAsync(request.ArticleId, request.ReviewerId, request.Comments);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteReview(int id, [FromBody] int rating)
        {
            try
            {
                await _reviewService.CompleteReviewAsync(id, rating);
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