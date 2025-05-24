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

        // Создание статьи
        public async Task<Article> CreateAsync(int authorId, string title, string body)
        {
            var author = await _userRepository.GetByIdAsync(authorId);
            if (author == null) throw new Exception("Автор не найден");

            var article = new Article
            {
                UserId = authorId,
                Name = title,
                Body = body,
                Status = "draft",
                RequestDate = DateTime.Now
            };

            await _articleRepository.AddAsync(article);
            await _articleRepository.SaveAsync();
            return article;
        }

        // Получение статей по статусу
        public async Task<List<Article>> GetByStatusAsync(string status)
        {
            return await _articleRepository.GetByStatusAsync(status);
        }

        // Отправка на рецензирование
        public async Task SubmitForReviewAsync(int articleId)
        {
            var article = await _articleRepository.GetByIdAsync(articleId);
            if (article == null) throw new Exception("Статья не найдена");

            article.Status = "under_review";
            _articleRepository.Update(article);
            await _articleRepository.SaveAsync();
        }
    }
}