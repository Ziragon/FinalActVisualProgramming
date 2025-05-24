using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class ProfileService
    {
        private readonly IProfileRepository _profileRepository;
        private readonly IUserRepository _userRepository;

        public ProfileService(IProfileRepository profileRepository, IUserRepository userRepository)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
        }

        // Создание/обновление профиля
        public async Task UpdateProfileAsync(int userId, string fullName, string email)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new Profile
                {
                    UserId = userId,
                    FullName = fullName,
                    Email = email
                };
                await _profileRepository.AddAsync(profile);
            }
            else
            {
                profile.FullName = fullName;
                profile.Email = email;
                _profileRepository.Update(profile);
            }

            await _profileRepository.SaveAsync();
        }

        // Получение профиля
        public async Task<Profile> GetProfileAsync(int userId)
        {
            return await _profileRepository.GetByUserIdAsync(userId);
        }
    }
}