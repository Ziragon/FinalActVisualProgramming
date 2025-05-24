using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IArticleRepository
    {
        Task<Article> GetByIdAsync(int id);
        Task<List<Article>> GetAllAsync();
        Task AddAsync(Article article);
        void Update(Article article);
        void Delete(Article article);
        Task<List<Article>> GetByUserIdAsync(int userId);
        Task<List<Article>> GetByStatusAsync(string status);
        Task SaveAsync();
    }
}