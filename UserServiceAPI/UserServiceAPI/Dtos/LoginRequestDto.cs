using System.ComponentModel.DataAnnotations;

namespace UserServiceAPI.Dtos
{
    public class LoginRequestDto
    {
        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9!@#$%^&*()_\-+=.]+$")]
        public string Password { get; set; } = string.Empty;
    }
}
