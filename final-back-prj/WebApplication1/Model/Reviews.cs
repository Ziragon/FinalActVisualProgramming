using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Reviews
    {
        private int _id;
        private int _articleId;
        private int _userId;
        private int _rating;
        private string _decision;
        private string _technicalMerit;
        private string _originality;
        private string _presentationQuality;
        private string _commentsToAuthor;
        private string _confidentialComments;
        private byte[] _attachments;
        private int _progress;
        private bool _status;
        private DateTime? _completeDate;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id
        {
            get => _id;
            set => _id = value;
        }

        [Required]
        [Column("article_id")]
        public int ArticleId
        {
            get => _articleId;
            set => _articleId = value;
        }

        [Required]
        [Column("user_id")]
        public int UserId
        {
            get => _userId;
            set => _userId = value;
        }

        [Column("rating")]
        public int Rating
        {
            get => _rating;
            set => _rating = (value >= 1 && value <= 5) ? value 
                : throw new ArgumentOutOfRangeException("Rating must be between 1 and 5");
        }

        [Column("decision")]
        public string Decision
        {
            get => _decision;
            set => _decision = value;
        }

        [Column("technical_merit")]
        public string TechnicalMerit
        {
            get => _technicalMerit;
            set => _technicalMerit = value;
        }

        [Column("originality")]
        public string Originality
        {
            get => _originality;
            set => _originality = value;
        }

        [Column("presentation_quality")]
        public string PresentationQuality
        {
            get => _presentationQuality;
            set => _presentationQuality = value;
        }

        [Column("comments_to_author")]
        public string CommentsToAuthor
        {
            get => _commentsToAuthor;
            set => _commentsToAuthor = value;
        }

        [Column("confidential_comments")]
        public string ConfidentialComments
        {
            get => _confidentialComments;
            set => _confidentialComments = value;
        }

        [Column("attachments", TypeName = "bytea")]
        public byte[] Attachments
        {
            get => _attachments;
            set => _attachments = value;
        }

        [Column("progress")]
        public int Progress
        {
            get => _progress;
            set => _progress = (value >= 0 && value <= 100) ? value 
                : throw new ArgumentOutOfRangeException("Progress must be between 0 and 100");
        }

        [Column("status")]
        public bool Status
        {
            get => _status;
            set => _status = value;
        }

        [Column("complete_date")]
        public DateTime? CompleteDate
        {
            get => _completeDate;
            set => _completeDate = value;
        }

        // Навигационное свойство к статье (1:1)
        [ForeignKey("ArticleId")]
        public virtual Articles Article { get; set; }

        // Навигационное свойство к пользователю (M:1)
        [ForeignKey("UserId")]
        public virtual Users User { get; set; }
    }
}