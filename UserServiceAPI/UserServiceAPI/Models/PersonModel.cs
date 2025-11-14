using System.ComponentModel.DataAnnotations;

namespace UserServiceAPI.Models
{
    public class PersonModel
    {
        [Key]
        public int PersonId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(5)]
        public string CountryCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        public int Age { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [MaxLength(500)]
        public string? PhotoUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
