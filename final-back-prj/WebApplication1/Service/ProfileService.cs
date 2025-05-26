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

        public async Task UpdateProfileAsync(int userId, string fullName, string email, string Institution, string FieldOfExpertise)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("Пользователь не найден");

            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new Profile
                {
                    UserId = userId,
                    FullName = fullName,
                    Email = email,
                    Institution = Institution,
                    FieldOfExpertise = FieldOfExpertise
                };
                await _profileRepository.AddAsync(profile);
            }
            else
            {
                profile.FullName = fullName;
                profile.Email = email;
                profile.Institution = Institution;
                profile.FieldOfExpertise= FieldOfExpertise;
                _profileRepository.Update(profile);
            }

            await _profileRepository.SaveAsync();
        }
        public async Task UpdateProfilePicAsync(int userId, int profilePicId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("Пользователь не найден");

            var profile = await _profileRepository.GetByUserIdAsync(userId);

            profile.ProfilePicId = profilePicId;
            _profileRepository.Update(profile);

            await _profileRepository.SaveAsync();
        }

        public async Task<Profile> GetByUserIdAsync(int userId)
        {
            return await _profileRepository.GetByUserIdAsync(userId);
        }

        public async Task<List<Profile>> GetProfilesAsync()
        {
            return await _profileRepository.GetProfilesAsync();
        }

        public async Task DeleteProfileAsync(int id)
        {
            var profile = await _profileRepository.GetByUserIdAsync(id);
            if (profile != null)
            {
                _profileRepository.Delete(profile);
                await _profileRepository.SaveAsync();
            }
        }
    }
}