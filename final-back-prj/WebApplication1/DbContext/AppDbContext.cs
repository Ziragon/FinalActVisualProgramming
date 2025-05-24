using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.DbContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<WebApplication1.Models.File> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> Profile (1:1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Role (M:1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Profile -> Articles (1:M)
            modelBuilder.Entity<Profile>()
                .HasMany(p => p.Articles)
                .WithOne(a => a.Profile)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Profile -> Reviews (1:M)
            modelBuilder.Entity<Profile>()
                .HasMany(p => p.Reviews)
                .WithOne(r => r.Profile)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Article -> Review (1:1)
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Review)
                .WithOne(r => r.Article)
                .HasForeignKey<Review>(r => r.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // File relationships (новые связи)
            modelBuilder.Entity<Profile>()
                .HasOne(p => p.ProfilePicture)
                .WithOne(f => f.Profile)
                .HasForeignKey<Profile>(p => p.ProfilePicId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Article>()
                .HasOne(a => a.ArticleFile)
                .WithOne(f => f.Article)
                .HasForeignKey<Article>(a => a.BodyFileId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Attachment)
                .WithOne(f => f.Review)
                .HasForeignKey<Review>(r => r.AttachmentsId)
                .OnDelete(DeleteBehavior.SetNull);

            // Настройки для Role
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(r => r.RoleId);
                entity.Property(r => r.RoleName).IsRequired().HasMaxLength(50);
            });

            // Настройки для File (чистая сущность без лишних FK)
            modelBuilder.Entity<WebApplication1.Models.File>(entity =>
            {
                entity.HasKey(f => f.Id);
                entity.Property(f => f.Name).IsRequired().HasMaxLength(255);
                entity.Property(f => f.Type).IsRequired().HasMaxLength(100);
                entity.Property(f => f.Content).IsRequired();
            });
        }
    }
}