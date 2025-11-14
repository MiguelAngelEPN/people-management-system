using System.ComponentModel.DataAnnotations;

namespace UserServiceAPI.Dtos
{
    public class UserPersonRequestDto
    {
        // ==== Person ====
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? Address { get; set; }
        public string? PhotoUrl { get; set; }

        // ==== User ====
        public string Username { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public bool IsActive { get; set; }

        // Solo se usa en CREATE, no en UPDATE
        public string? Password { get; set; }
    }
}
