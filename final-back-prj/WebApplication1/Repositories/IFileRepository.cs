using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IFileRepository
    {
        Task<Models.File> GetByIdAsync(int id);
        Task<List<Models.File>> GetAllAsync();
        Task AddAsync(Models.File file);
        void Update(Models.File file);
        void Delete(Models.File file);
        Task<List<Models.File>> GetByReviewIdAsync(int reviewId);
        Task<Models.File> GetProfilePictureAsync(int profileId);
        Task SaveAsync();
    }
}