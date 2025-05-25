using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    [Table("profile")]
    public class Profile
    {
        [Key]
        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("profile_pic_id")]
        [StringLength(255)]
        public int? ProfilePicId { get; set; }

        [Required]
        [Column("full_name")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [Column("email")]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Column("institution")]
        [StringLength(100)]
        public string? Institution { get; set; }

        [Column("field_of_expertise")]
        [StringLength(100)]
        public string? FieldOfExpertise { get; set; }

        [ForeignKey("ProfilePicId")]
        public virtual File ProfilePicture { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }
        public virtual ICollection<Article> Articles { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
    }
}