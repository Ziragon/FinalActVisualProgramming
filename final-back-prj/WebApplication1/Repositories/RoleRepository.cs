using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DbContext;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _db;

        public RoleRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            return await _db.Roles.FindAsync(id);
        }

        public async Task<List<Role>> GetAllAsync()
        {
            return await _db.Roles.ToListAsync();
        }

        public async Task AddAsync(Role role)
        {
            await _db.Roles.AddAsync(role);
        }

        public void Update(Role role)
        {
            _db.Roles.Update(role);
        }

        public void Delete(Role role)
        {
            _db.Roles.Remove(role);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<Role> GetByNameAsync(string roleName)
        {
            return await _db.Roles
                .FirstOrDefaultAsync(r => r.RoleName == roleName);
        }
    }
}