using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IArticleRepository _articleRepository;

        public ReviewService(IReviewRepository reviewRepository, IArticleRepository articleRepository)
        {
            _reviewRepository = reviewRepository;
            _articleRepository = articleRepository;
        }

        // Создание рецензии
        public async Task<Review> CreateReviewAsync(int articleId, int reviewerId, string comments)
        {
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

        // Завершение рецензии
        public async Task CompleteReviewAsync(int reviewId, int rating)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Рецензия не найдена");

            review.Rating = rating;
            review.IsCompleted = true;
            review.CompleteDate = DateTime.UtcNow;
            review.Progress = 100;

            _reviewRepository.Update(review);
            await _reviewRepository.SaveAsync();
        }
    }
}