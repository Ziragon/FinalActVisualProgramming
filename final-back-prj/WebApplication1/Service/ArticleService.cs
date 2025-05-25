using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class ArticleService
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IUserRepository _userRepository;

        public ArticleService(IArticleRepository articleRepository, IUserRepository userRepository)
        {
            _articleRepository = articleRepository;
            _userRepository = userRepository;
        }
        public async Task<Article> CreateAsync(int authorId, string name, string category, string body, int? body_id, string tags, string status)
        {
            var author = await _userRepository.GetByIdAsync(authorId);
            if (author == null) throw new Exception("Автор не найден");
            if (author.RoleId != 3) throw new Exception("Только пользователи могут создавать статьи");

            var article = new Article
            {
                UserId = authorId,
                Name = name,
                ArticleCode = "",
                Category = category,
                Body = body,
                BodyFileId = body_id,
                Tags = tags,
                Status = status,
                RequestDate = DateTime.Now
            };

            await _articleRepository.AddAsync(article);
            await _articleRepository.SaveAsync();
            return article;
        }

        public async Task<List<Article>> GetByStatusAsync(string status)
        {
            return await _articleRepository.GetByStatusAsync(status);
        }

        public async Task SubmitForReviewAsync(int articleId, int currentUserId)
        {
            var article = await _articleRepository.GetByIdAsync(articleId);
            if (article == null) throw new Exception("Статья не найдена");
            if (article.UserId != currentUserId) throw new UnauthorizedAccessException("Вы не автор статьи");

            article.Status = "under_review";
            _articleRepository.Update(article);
            await _articleRepository.SaveAsync();
        }

        public async Task<List<Article>> GetArticlesByUserIdAsync(int userId)
        {
            return await _articleRepository.GetByUserIdAsync(userId);
        }
    }
}