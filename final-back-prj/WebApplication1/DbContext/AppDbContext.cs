using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Roles> Roles { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Articles> Articles { get; set; }
        public DbSet<Reviews> Reviews { get; set; }

        // AppDbContext.cs
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.RoleId);
                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            // Конфигурация таблицы Users
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);

                // Связь с Roles (M:1)
                entity.HasOne(u => u.Role)  // было u.Roles
                    .WithMany(r => r.Users)
                    .HasForeignKey(u => u.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Конфигурация таблицы Profile
            modelBuilder.Entity<Profile>(entity =>
            {
                entity.HasKey(e => e.UserId);

                // Связь 1:1 с Users
                entity.HasOne(p => p.User)
                    .WithOne(u => u.Profile)
                    .HasForeignKey<Profile>(p => p.UserId);
            });

            // Конфигурация таблицы Articles
            modelBuilder.Entity<Articles>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                // Связь с Users (M:1)
                entity.HasOne(a => a.User)
                    .WithMany(u => u.Articles)
                    .HasForeignKey(a => a.UserId);
            });

            // Конфигурация таблицы Reviews
            modelBuilder.Entity<Reviews>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Проверка диапазона рейтинга (альтернатива HasCheckConstraint)
                entity.Property(e => e.Rating)
                    .IsRequired(false); // или .IsRequired() в зависимости от требований

                // Проверка прогресса (альтернатива HasCheckConstraint)
                entity.Property(e => e.Progress)
                    .IsRequired(false); // или .IsRequired() в зависимости от требований

                // Связь 1:1 с Articles
                entity.HasOne(r => r.Article)
                    .WithOne(a => a.Review)
                    .HasForeignKey<Reviews>(r => r.ArticleId);

                // Связь M:1 с Users (рецензент)
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}