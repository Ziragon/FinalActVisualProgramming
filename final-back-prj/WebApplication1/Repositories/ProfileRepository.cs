using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly AppDbContext _db;

        public ProfileRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Profile> GetByUserIdAsync(int userId)
        {
            return await _db.Profiles.FindAsync(userId);
        }

        public async Task<List<Profile>> GetProfilesAsync()
        {
            return await _db.Profiles.ToListAsync();
        }

        public async Task AddAsync(Profile profile)
        {
            await _db.Profiles.AddAsync(profile);
        }

        public void Update(Profile profile)
        {
            _db.Profiles.Update(profile);
        }

        public void Delete(Profile profile)
        {
            _db.Profiles.Remove(profile);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}