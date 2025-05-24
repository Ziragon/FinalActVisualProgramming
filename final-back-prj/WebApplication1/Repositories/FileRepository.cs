using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using File = WebApplication1.Models.File; // Алиас для удобства

namespace WebApplication1.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly AppDbContext _db;

        public FileRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<File> GetByIdAsync(int id)
        {
            return await _db.Files.FindAsync(id);
        }

        public async Task<List<File>> GetAllAsync()
        {
            return await _db.Files.ToListAsync();
        }

        public async Task AddAsync(File file)
        {
            await _db.Files.AddAsync(file);
        }

        public void Update(File file)
        {
            _db.Files.Update(file);
        }

        public void Delete(File file)
        {
            _db.Files.Remove(file);
        }

        public async Task<List<File>> GetByReviewIdAsync(int reviewId)
        {
            var review = await _db.Reviews
                .Include(r => r.Attachment)
                .FirstOrDefaultAsync(r => r.Id == reviewId);
    
            return review?.Attachment != null ? new List<File> { review.Attachment } : new List<File>();
        }

        public async Task<File> GetProfilePictureAsync(int profileId)
        {
            var profile = await _db.Profiles
                .Include(p => p.ProfilePicture)
                .FirstOrDefaultAsync(p => p.UserId == profileId);
    
            return profile?.ProfilePicture;
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}