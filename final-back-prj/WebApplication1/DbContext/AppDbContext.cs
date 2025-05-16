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
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.RoleId);
                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(255);
            });
            
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.HasOne(u => u.Role) 
                    .WithMany(r => r.Users)
                    .HasForeignKey(u => u.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            modelBuilder.Entity<Profile>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.HasOne(p => p.User)
                    .WithOne(u => u.Profile)
                    .HasForeignKey<Profile>(p => p.UserId);
            });

            modelBuilder.Entity<Articles>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);
                
                entity.HasOne(a => a.User)
                    .WithMany(u => u.Articles)
                    .HasForeignKey(a => a.UserId);
            });
            
            modelBuilder.Entity<Reviews>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Rating)
                    .IsRequired(false); 

                entity.Property(e => e.Progress)
                    .IsRequired(false); 

                entity.HasOne(r => r.Article)
                    .WithOne(a => a.Review)
                    .HasForeignKey<Reviews>(r => r.ArticleId);
                
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}