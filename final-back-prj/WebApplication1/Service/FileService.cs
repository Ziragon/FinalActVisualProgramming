using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.DbContext;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class FileService
    {
        private readonly IFileRepository _fileRepository;
        private readonly AppDbContext _dbContext;
        private readonly IUserRepository _userRepository;

        public FileService(IFileRepository fileRepository,
                         AppDbContext dbContext,
                         IUserRepository userRepository)
        {
            _fileRepository = fileRepository;
            _dbContext = dbContext;
            _userRepository = userRepository;
        }

        public async Task<Models.File> UploadFileAsync(byte[] content, string fileName, string contentType, int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("Пользователь не найден");

            var file = new Models.File
            {
                Name = fileName,
                Type = contentType,
                Content = content,
                UploadDate = DateTime.UtcNow,
            };

            await _fileRepository.AddAsync(file);
            await _fileRepository.SaveAsync();
            return file;
        }

        public async Task AttachToArticleAsync(int fileId, int articleId, int currentUserId)
        {
            var article = await _dbContext.Articles
                .FirstOrDefaultAsync(a => a.Id == articleId);

            if (article == null)
                throw new Exception("Статья не найдена");

            if (article.UserId != currentUserId)
                throw new UnauthorizedAccessException("Вы не автор статьи");

            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
                throw new Exception("Файл не найден");

            article.BodyFileId = fileId;
            _dbContext.Articles.Update(article);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AttachToProfileAsync(int fileId, int userId)
        {
            var profile = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                throw new Exception("Профиль не найден");

            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
                throw new Exception("Файл не найден");

            profile.ProfilePicId = fileId;
            _dbContext.Profiles.Update(profile);
            await _dbContext.SaveChangesAsync();
        }
    }
}