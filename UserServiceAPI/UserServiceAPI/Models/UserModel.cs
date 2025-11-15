using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System;

namespace UserServiceAPI.Models
{
    [Table("Users")]
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public Guid UserGuid { get; set; }

        [Required]
        [ForeignKey("Person")]
        public int PersonId { get; set; }
        public PersonModel Person { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; }

        public string PasswordSalt { get; set; }

        [Required]
        [ForeignKey("Role")]
        public int RoleId { get; set; }
        public RoleModel Role { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
