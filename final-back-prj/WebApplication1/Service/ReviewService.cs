using Azure.Core;
using WebApplication1.Models;
using WebApplication1.Repositories;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApplication1.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IArticleRepository _articleRepository;
        private readonly IUserRepository _userRepository;

        public ReviewService(IReviewRepository reviewRepository,
                           IArticleRepository articleRepository,
                           IUserRepository userRepository)
        {
            _reviewRepository = reviewRepository;
            _articleRepository = articleRepository;
            _userRepository = userRepository;
        }

        public int CalculateProgress(Review review)
        {
            int totalFields = 7;
            int filledFields = 0;

            if (review.Rating.HasValue) filledFields++;
            if (!string.IsNullOrEmpty(review.Decision)) filledFields++;
            if (!string.IsNullOrEmpty(review.TechnicalMerit)) filledFields++;
            if (!string.IsNullOrEmpty(review.Originality)) filledFields++;
            if (!string.IsNullOrEmpty(review.PresentationQuality)) filledFields++;
            if (!string.IsNullOrEmpty(review.CommentsToAuthor)) filledFields++;
            if (!string.IsNullOrEmpty(review.ConfidentialComments)) filledFields++;

            // Рассчитываем процент (1-99)
            int progress = (int)Math.Round((double)filledFields / totalFields * 98) + 1;
            return Math.Clamp(progress, 1, 99);
        }

        public async Task<Review> CreateReviewAsync(int articleId, int reviewerId)
        {
            var reviewer = await _userRepository.GetByIdAsync(reviewerId);
            if (reviewer == null) throw new Exception("Рецензент не найден");
            if (reviewer.RoleId != 2) throw new Exception("Только рецензенты могут создавать рецензии");

            var article = await _articleRepository.GetByIdAsync(articleId);
            if (article == null) throw new Exception("Статья не найдена");

            article.Status = "under_review";
            var review = new Review
            {
                Id = articleId,
                ArticleId = articleId,
                UserId = reviewerId,
                IsCompleted = false,
                Progress = 0
            };

            await _reviewRepository.AddAsync(review);
            _articleRepository.Update(article);
            await _reviewRepository.SaveAsync();
            await _articleRepository.SaveAsync();
            return review;
        }

        public async Task UpdateReviewAsync(int reviewId, int reviewerId, int? rating, string? decision,
                                            string? technicalMerit, string? originality, string? presentationQuality,
                                            string? commentsToAuthor, string? confidentialComments, int? attachmentsId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Рецензия не найдена");
            if (review.UserId != reviewerId) throw new UnauthorizedAccessException("Вы не автор рецензии");
            if (review == null)
            {
                review = new Review
                {
                    Id = reviewId,
                    UserId = reviewerId,
                    Rating = rating,
                    Decision = decision,
                    TechnicalMerit = technicalMerit,
                    Originality = originality,
                    PresentationQuality = presentationQuality,
                    CommentsToAuthor = commentsToAuthor,
                    ConfidentialComments = confidentialComments,
                    AttachmentsId = attachmentsId,
                    Progress = CalculateProgress(review)
                };
                await _reviewRepository.AddAsync(review);
            }
            else
            {
                review.Rating = rating;
                review.Decision = decision;
                review.TechnicalMerit = technicalMerit;
                review.Originality = originality;
                review.PresentationQuality = presentationQuality;
                review.CommentsToAuthor = commentsToAuthor;
                review.ConfidentialComments = confidentialComments;
                review.AttachmentsId = attachmentsId;
                review.Progress = CalculateProgress(review);
                _reviewRepository.Update(review);
            }
            await _reviewRepository.SaveAsync();
        }

        public async Task CompleteReviewAsync(int reviewId, int currentUserId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Рецензия не найдена");
            if (review.UserId != currentUserId) throw new UnauthorizedAccessException("Вы не автор рецензии");

            var article = await _articleRepository.GetByIdAsync(reviewId);
            if (article == null) throw new Exception("Статья не найдена");

            article.Status = "reviewed";

            review.IsCompleted = true;
            review.CompleteDate = DateTime.UtcNow;
            review.Progress = 100;

            _reviewRepository.Update(review);
            await _reviewRepository.SaveAsync();
            _articleRepository.Update(article);
            await _articleRepository.SaveAsync();
        }
        public async Task<List<Review>> GetByStatusAsync(bool status)
        {
            return await _reviewRepository.GetByStatusAsync(status);
        }
        public async Task<List<Review>> GetAllAsync()
        {
            return await _reviewRepository.GetAllAsync();
        }
        public async Task<List<Review>> GetReviewsByUserIdAsync(int userId)
        {
            return await _reviewRepository.GetByUserIdAsync(userId);
        }
        public async Task<Review> GetArticleByIdAsync(int reviewId)
        { 
            return await _reviewRepository.GetByIdAsync(reviewId);
        }
        public async Task DeleteReviewAsync(int reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review != null)
            {
                _reviewRepository.Delete(review);
                await _reviewRepository.SaveAsync();
            }
        }
    }
}