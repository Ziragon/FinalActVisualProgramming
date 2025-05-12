using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Articles
    {
        private int _id;
        private string _name;
        private string _article;
        private int _userId;
        private string _category;
        private byte[] _body;
        private string[] _tags;
        private DateTime _requestDate;
        private string _status;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id
        {
            get => _id;
            set => _id = value;
        }

        [Required]
        [StringLength(255)]
        [Column("name")]
        public string Name
        {
            get => _name;
            set => _name = value ?? throw new ArgumentNullException(nameof(value));
        }

        [Column("article")]
        public string Article
        {
            get => _article;
            set => _article = value;
        }

        [Required]
        [Column("user_id")]
        public int UserId
        {
            get => _userId;
            set => _userId = value;
        }

        [StringLength(100)]
        [Column("category")]
        public string Category
        {
            get => _category;
            set => _category = value;
        }

        [Column("body", TypeName = "bytea")]
        public byte[] Body
        {
            get => _body;
            set => _body = value;
        }

        [Column("tags", TypeName = "varchar[]")]
        public string[] Tags
        {
            get => _tags;
            set => _tags = value;
        }

        [Column("request_date")]
        public DateTime RequestDate
        {
            get => _requestDate;
            set => _requestDate = value;
        }

        [Column("status")]
        public string Status
        {
            get => _status;
            set => _status = value;
        }

        // Навигационное свойство к пользователю (M:1)
        [ForeignKey("UserId")]
        public virtual Users User { get; set; }

        // Навигационное свойство к рецензии (1:1)
        public virtual Reviews Review { get; set; }
    }
}