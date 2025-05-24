using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task AddAsync(User user)
        {
            await _db.Users.AddAsync(user);
        }

        public void Update(User user)
        {
            _db.Users.Update(user);
        }

        public void Delete(User user)
        {
            _db.Users.Remove(user);
        }

        public async Task<User> GetByLoginAsync(string login)
        {
            return await _db.Users.Include(u=>u.Profile).AsNoTracking().FirstOrDefaultAsync(u => u.Login == login);
        }

        public async Task<bool> LoginExistsAsync(string login)
        {
            return await _db.Users.AnyAsync(u => u.Login == login);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}