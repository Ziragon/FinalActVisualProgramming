using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly AppDbContext _db;

        public ArticleRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Article> GetByIdAsync(int id)
        {
            return await _db.Articles.FindAsync(id);
        }

        public async Task<List<Article>> GetAllAsync()
        {
            return await _db.Articles.ToListAsync();
        }

        public async Task AddAsync(Article article)
        {
            await _db.Articles.AddAsync(article);
        }

        public void Update(Article article)
        {
            _db.Articles.Update(article);
        }

        public void Delete(Article article)
        {
            _db.Articles.Remove(article);
        }

        public async Task<List<Article>> GetByUserIdAsync(int userId)
        {
            return await _db.Articles
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Article>> GetByStatusAsync(string status)
        {
            return await _db.Articles
                .Where(a => a.Status == status)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}