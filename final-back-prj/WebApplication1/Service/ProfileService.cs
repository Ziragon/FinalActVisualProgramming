using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class ProfileService
    {
        private readonly IProfileRepository _profileRepository;
        private readonly IUserRepository _userRepository;
        private readonly IArticleRepository _articleRepository;
        private readonly IReviewRepository _reviewRepository;

        public ProfileService(
            IUserRepository userRepository,
            IProfileRepository profileRepository,
            IArticleRepository articleRepository,
            IReviewRepository reviewRepository)
        {
            _userRepository = userRepository;
            _profileRepository = profileRepository;
            _articleRepository = articleRepository;
            _reviewRepository = reviewRepository;
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
            if (profile == null) return;

            var articles = await _articleRepository.GetByUserIdAsync(id);
            foreach (var article in articles)
            {
                var articleReviews = await _reviewRepository.GetByArticleIdAsync(article.Id);
                foreach (var review in articleReviews)
                {
                    _reviewRepository.Delete(review);
                }

                _articleRepository.Delete(article);
            }

            var userReviews = await _reviewRepository.GetByUserIdAsync(id);
            foreach (var review in userReviews)
            {
                _reviewRepository.Delete(review);
            }

            _profileRepository.Delete(profile);

            await _userRepository.SaveAsync();
        }
    }
}