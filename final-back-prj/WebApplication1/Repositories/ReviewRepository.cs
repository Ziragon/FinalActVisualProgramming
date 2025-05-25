using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _db;

        public ReviewRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Review> GetByIdAsync(int id)
        {
            return await _db.Reviews.FindAsync(id);
        }

        public async Task<List<Review>> GetAllAsync()
        {
            return await _db.Reviews.ToListAsync();
        }

        public async Task AddAsync(Review review)
        {
            await _db.Reviews.AddAsync(review);
        }

        public void Update(Review review)
        {
            _db.Reviews.Update(review);
        }

        public void Delete(Review review)
        {
            _db.Reviews.Remove(review);
        }

        public async Task<List<Review>> GetByArticleIdAsync(int articleId)
        {
            return await _db.Reviews
                .Where(r => r.ArticleId == articleId)
                .ToListAsync();
        }

        public async Task<List<Review>> GetByUserIdAsync(int userId)
        {
            return await _db.Reviews
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
        public async Task<List<Review>> GetByStatusAsync(bool status)
        {
            return await _db.Reviews
                .Where(a => a.IsCompleted == status)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}