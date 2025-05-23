﻿using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Регистрация пользователя
        public async Task<bool> RegisterAsync(string login, string password, int roleid)
        {
            if (await _userRepository.LoginExistsAsync(login))
                return false;

            var user = new User 
            { 
                Login = login, 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                RoleId = roleid
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();
            return true;
        }

        // Аутентификация
        public async Task<User> AuthenticateAsync(string login, string password)
        {
            var user = await _userRepository.GetByLoginAsync(login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;

            return user;
        }

        // Получение пользователя по ID
        public async Task<User> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        // Удаление пользователя
        public async Task DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user != null)
            {
                _userRepository.Delete(user);
                await _userRepository.SaveAsync();
            }
        }
    }
}