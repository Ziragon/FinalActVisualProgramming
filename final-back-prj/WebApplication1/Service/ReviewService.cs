using WebApplication1.Models;
using WebApplication1.Repositories;

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

        public async Task<Review> CreateReviewAsync(int articleId, int reviewerId, string comments)
        {
            var reviewer = await _userRepository.GetByIdAsync(reviewerId);
            if (reviewer == null) throw new Exception("Рецензент не найден");
            if (reviewer.RoleId != 2) throw new Exception("Только рецензенты могут создавать рецензии");

            var article = await _articleRepository.GetByIdAsync(articleId);
            if (article == null) throw new Exception("Статья не найдена");

            var review = new Review
            {
                ArticleId = articleId,
                UserId = reviewerId,
                CommentsToAuthor = comments,
                IsCompleted = false,
                Progress = 0
            };

            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveAsync();
            return review;
        }

        public async Task CompleteReviewAsync(int reviewId, int rating, int currentUserId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Рецензия не найдена");
            if (review.UserId != currentUserId) throw new UnauthorizedAccessException("Вы не автор рецензии");

            review.Rating = rating;
            review.IsCompleted = true;
            review.CompleteDate = DateTime.UtcNow;
            review.Progress = 100;

            _reviewRepository.Update(review);
            await _reviewRepository.SaveAsync();
        }
    }
}