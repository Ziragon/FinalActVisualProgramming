using WebApplication1.Models;
using WebApplication1.Repositories;
using WebApplication1.DbContext;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Services
{
    public class FileService
    {
        private readonly IFileRepository _fileRepository;
        private readonly AppDbContext _dbContext;

        public FileService(IFileRepository fileRepository, AppDbContext dbContext)
        {
            _fileRepository = fileRepository;
            _dbContext = dbContext;
        }

        // Загрузка файла
        public async Task<Models.File> UploadFileAsync(byte[] content, string fileName, string contentType)
        {
            var file = new Models.File
            {
                Name = fileName,
                Type = contentType,
                Content = content,
                UploadDate = DateTime.UtcNow
            };

            await _fileRepository.AddAsync(file);
            await _fileRepository.SaveAsync();
            return file;
        }

        // Прикрепление файла к статье (новая версия)
        public async Task AttachToArticleAsync(int fileId, int articleId)
        {
            var article = await _dbContext.Articles
                .FirstOrDefaultAsync(a => a.Id == articleId);
            
            if (article == null) 
                throw new Exception("Статья не найдена");

            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null) 
                throw new Exception("Файл не найден");

            // Обновляем связь через body_id в Article
            article.BodyFileId = fileId;
            _dbContext.Articles.Update(article);
            await _dbContext.SaveChangesAsync();
        }

        // Прикрепление аватарки к профилю
        public async Task AttachToProfileAsync(int fileId, int profileId)
        {
            var profile = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.UserId == profileId);
            
            if (profile == null)
                throw new Exception("Профиль не найден");

            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
                throw new Exception("Файл не найден");

            profile.ProfilePicId = fileId;
            _dbContext.Profiles.Update(profile);
            await _dbContext.SaveChangesAsync();
        }

        // Прикрепление файла к рецензии
        public async Task AttachToReviewAsync(int fileId, int reviewId)
        {
            var review = await _dbContext.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId);
            
            if (review == null)
                throw new Exception("Рецензия не найдена");

            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
                throw new Exception("Файл не найден");

            review.AttachmentsId = fileId;
            _dbContext.Reviews.Update(review);
            await _dbContext.SaveChangesAsync();
        }
    }
}