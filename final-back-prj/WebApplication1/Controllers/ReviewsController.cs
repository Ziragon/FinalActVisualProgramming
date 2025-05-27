using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

        [Authorize(Roles = "2")]
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateRequest request)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                var review = await _reviewService.CreateReviewAsync(request.ArticleId, currentUserId);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "2")]
        [HttpPut("{reviewId}")]
        public async Task<IActionResult> Update(int reviewId, [FromBody] ReviewUpdateRequest request)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                if (currentUserId != request.ReviewerId)
                    return Forbid();

                await _reviewService.UpdateReviewAsync(reviewId, request.ReviewerId, request.Rating, request.Decision, 
                                                                    request.TechnicalMerit, request.Originality, request.PresentationQuality,
                                                                    request.CommentsToAuthor, request.ConfidentialComments, request.AttachmentsId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "2")]
        [HttpPost("{reviewId}/complete")]
        public async Task<IActionResult> CompleteReview(int reviewId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
                await _reviewService.CompleteReviewAsync(reviewId, currentUserId);
                return Ok("Рецензия завершена");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "2")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetArticlesByUser(int userId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByUserIdAsync(userId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{reviewId}")]
        public async Task<IActionResult> GetReviewById(int reviewId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewByIdAsync(reviewId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "2")]
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(bool status)
        {
            var reviews = await _reviewService.GetByStatusAsync(status);
            return Ok(reviews);
        }

        [Authorize(Roles = "1")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var reviews = await _reviewService.GetAllAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "1")]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            try
            {
                await _reviewService.DeleteReviewAsync(reviewId);
                return NoContent();
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
    }

    public class ReviewUpdateRequest
    {
        public int ReviewerId { get; set; }
        public int? Rating {  get; set; }
        public string? Decision {  get; set; }
        public string? TechnicalMerit { get; set; }
        public string? Originality { get; set; }
        public string? PresentationQuality { get; set; }
        public string? CommentsToAuthor { get; set; }
        public string? ConfidentialComments { get; set; }
        public int? AttachmentsId {  get; set; }
        public int Progress { get; set; }
    }
}