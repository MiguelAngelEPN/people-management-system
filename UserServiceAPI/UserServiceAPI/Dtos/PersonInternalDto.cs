namespace UserServiceAPI.Dtos
{
    public class PersonInternalDto
    {
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
