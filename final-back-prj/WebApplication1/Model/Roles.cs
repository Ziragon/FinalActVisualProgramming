using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Roles
    {
        private int _roleId;
        private string _roleName;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("role_id")]
        public int RoleId
        {
            get => _roleId;
            set => _roleId = value;
        }

        [Required]
        [StringLength(255)]
        [Column("role_name")]
        public string RoleName
        {
            get => _roleName;
            set => _roleName = value ?? throw new ArgumentNullException(nameof(value));
        }

        // Навигационное свойство для связи с пользователями
        public virtual ICollection<Users> Users { get; set; }
    }
}