namespace UserServiceAPI.Dtos
{
    public class UserInternalDto
    {
        public string Username { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public bool IsActive { get; set; }

        // Solo si es register
        public string? Password { get; set; }
    }
}
