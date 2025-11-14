using System.ComponentModel.DataAnnotations;

namespace UserServiceAPI.Models
{
    public class RoleModel
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }
    }
}
