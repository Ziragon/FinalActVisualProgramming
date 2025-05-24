using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IProfileRepository
    {
        Task<Profile> GetByUserIdAsync(int userId);
        Task AddAsync(Profile profile);
        void Update(Profile profile);
        void Delete(Profile profile);
        Task SaveAsync();
    }
}