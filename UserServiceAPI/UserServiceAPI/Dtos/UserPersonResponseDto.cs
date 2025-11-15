namespace UserServiceAPI.Dtos
{
    public class UserPersonResponseDto
    {
        // ==== User ====
        public int UserId { get; set; }
        public Guid UserGuid { get; set; }
        public string Username { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // ==== Person ====
        public int PersonId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? Address { get; set; }
        public string? PhotoUrl { get; set; }
    }
}
