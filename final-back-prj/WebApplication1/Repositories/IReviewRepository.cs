using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IReviewRepository
    {
        Task<Review> GetByIdAsync(int id);
        Task<List<Review>> GetAllAsync();
        Task AddAsync(Review review);
        void Update(Review review);
        void Delete(Review review);
        Task<List<Review>> GetByArticleIdAsync(int articleId);
        Task<List<Review>> GetByUserIdAsync(int userId);
        Task<List<Review>> GetByStatusAsync(bool status);
        Task SaveAsync();
    }
}