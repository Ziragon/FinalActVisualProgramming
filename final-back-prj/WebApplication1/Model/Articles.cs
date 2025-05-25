using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    [Table("articles")]
    public class Article
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [StringLength(200)]
        public string Name { get; set; }

        [Column("article")]
        [StringLength(50)]
        public string? ArticleCode { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("category")]
        [StringLength(100)]
        public string? Category { get; set; }

        [Column("body", TypeName = "text")]
        public string? Body { get; set; }

        [Column("body_id")]
        [StringLength(255)]
        public int? BodyFileId { get; set; } // Идентификатор файла (docx/pdf)

        [Column("tags")]
        [StringLength(200)]
        public string? Tags { get; set; }

        [Required]
        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; } = "editing";

        [Required]
        [Column("request_date", TypeName = "timestamp")]
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("BodyFileId")]
        public virtual File ArticleFile { get; set; }

        [ForeignKey("UserId")]
        public virtual Profile Profile { get; set; }
        public virtual Review Review { get; set; }
    }
}