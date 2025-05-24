using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [Column("login")]
        [StringLength(50, MinimumLength = 3)]
        public string Login { get; set; }

        [Required]
        [Column("password_hash")]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; }
        
        public virtual Profile Profile { get; set; }
    }
}