using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Users
    {
        private int _userId;
        private string _login;
        private string _passwordHash;
        private int _roleId;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("user_id")]
        public int UserId
        {
            get => _userId;
            set => _userId = value;
        }

        [Required]
        [StringLength(255)]
        [Column("login")]
        public string Login
        {
            get => _login;
            set => _login = value ?? throw new ArgumentNullException(nameof(value));
        }

        [Required]
        [StringLength(255)]
        [Column("password_hash")]
        public string PasswordHash
        {
            get => _passwordHash;
            set => _passwordHash = value ?? throw new ArgumentNullException(nameof(value));
        }

        [Column("role_id")]
        public int RoleId
        {
            get => _roleId;
            set => _roleId = value;
        }

        // Только две навигационные свойства (без articles/reviews!)
        [ForeignKey("RoleId")]
        public virtual Roles Role { get; set; }  // Связь M:1 с roles
        public virtual Profile Profile { get; set; }  // Связь 1:1 с profile
        public virtual ICollection<Articles> Articles { get; set; }
        public virtual ICollection<Reviews> Reviews { get; set; }
    }
}