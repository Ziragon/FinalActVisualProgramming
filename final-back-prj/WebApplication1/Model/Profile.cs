using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Profile
    {
        private int _userId;
        private string _fullName;
        private int? _articleId;
        private int? _reviewId;
        private string _email;
        private string _institution;
        private string _fieldOfExpertise;

        [Key]
        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId
        {
            get => _userId;
            set => _userId = value;
        }

        [StringLength(255)]
        [Column("full_name")]
        public string FullName
        {
            get => _fullName;
            set => _fullName = value;
        }

        [Column("article_id")]
        public int? ArticleId
        {
            get => _articleId;
            set => _articleId = value;
        }

        [Column("review_id")]
        public int? ReviewId
        {
            get => _reviewId;
            set => _reviewId = value;
        }

        [StringLength(255)]
        [Column("email")]
        public string Email
        {
            get => _email;
            set => _email = value;
        }

        [StringLength(255)]
        [Column("institution")]
        public string Institution
        {
            get => _institution;
            set => _institution = value;
        }

        [StringLength(255)]
        [Column("field_of_expertise")]
        public string FieldOfExpertise
        {
            get => _fieldOfExpertise;
            set => _fieldOfExpertise = value;
        }

        // Навигационное свойство (1:1 с Users)
        public virtual Users User { get; set; }

        // Навигационные свойства для связей
        public virtual Articles Article { get; set; }
        public virtual Reviews Review { get; set; }
    }
}