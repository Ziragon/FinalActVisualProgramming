using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class RoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        // Создание новой роли
        public async Task<Role> CreateRoleAsync(string roleName)
        {
            if (await _roleRepository.GetByNameAsync(roleName) != null)
                throw new Exception("Роль с таким названием уже существует");

            var role = new Role { RoleName = roleName };
            await _roleRepository.AddAsync(role);
            await _roleRepository.SaveAsync();
            return role;
        }

        // Получение всех ролей
        public async Task<List<Role>> GetAllRolesAsync()
        {
            return await _roleRepository.GetAllAsync();
        }

        // Удаление роли
        public async Task DeleteRoleAsync(int roleId)
        {
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
                throw new Exception("Роль не найдена");

            _roleRepository.Delete(role);
            await _roleRepository.SaveAsync();
        }

        // Назначение роли пользователю (пример интеграции с UserService)
        public async Task AssignRoleToUserAsync(int userId, int roleId, UserService userService)
        {
            var user = await userService.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("Пользователь не найден");

            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
                throw new Exception("Роль не найдена");

            user.RoleId = roleId;
            // Здесь потребуется метод Update в UserService
        }
    }
}