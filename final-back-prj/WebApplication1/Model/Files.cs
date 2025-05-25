using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    [Table("files")]
    public class File
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [Column("type")]
        [StringLength(100)]
        public string Type { get; set; }

        [Required]
        [Column("content", TypeName = "bytea")]
        public byte[] Content { get; set; }

        [Column("upload_date")]
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        public virtual Profile Profile { get; set; }  // Для profile_pic_id
        public virtual Article Article { get; set; }  // Для body_id
        public virtual Review Review { get; set; }    // Для attachments_id
    }
}