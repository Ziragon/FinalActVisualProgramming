using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    [Table("reviews")]
    public class Review
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Column("article_id")]
        public int ArticleId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("rating")]
        [Range(1, 5)]
        public int? Rating { get; set; }

        [Column("decision")]
        [StringLength(50)]
        public string? Decision { get; set; }

        [Column("technical_merit", TypeName = "text")]
        public string? TechnicalMerit { get; set; }

        [Column("originality", TypeName = "text")]
        public string? Originality { get; set; }

        [Column("presentation_quality", TypeName = "text")]
        public string? PresentationQuality { get; set; }

        [Column("comments_to_author", TypeName = "text")]
        public string? CommentsToAuthor { get; set; }

        [Column("confidential_comments", TypeName = "text")]
        public string? ConfidentialComments { get; set; }

        [Column("attachments_id")]
        [StringLength(255)]
        public int? AttachmentsId { get; set; }

        [Column("progress")]
        [Range(0, 100)]
        public int Progress { get; set; }

        [Required]
        [Column("status")]
        public bool IsCompleted { get; set; } = false;

        [Column("complete_date", TypeName = "timestamp with time zone")]
        public DateTime? CompleteDate { get; set; }

        [ForeignKey("AttachmentsId")]
        public virtual File Attachment { get; set; }

        [ForeignKey("ArticleId")]
        [JsonIgnore]
        public virtual Article Article { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual Profile Profile { get; set; }
    }
}