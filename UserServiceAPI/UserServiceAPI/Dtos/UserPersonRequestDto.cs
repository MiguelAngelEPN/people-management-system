using System.ComponentModel.DataAnnotations;

namespace UserServiceAPI.Dtos
{
    public class UserPersonRequestDto
    {
        // ============================
        // PERSON
        // ============================

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 100 caracteres.")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        [EmailAddress(ErrorMessage = "Debe ingresar un email válido.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(5, ErrorMessage = "El código de país no puede exceder 5 caracteres.")]
        [RegularExpression(@"^\+[0-9]{1,4}$",
            ErrorMessage = "El código de país debe iniciar con '+' y contener entre 1 y 4 dígitos.")]
        public string CountryCode { get; set; } = string.Empty;

        [Required]
        [StringLength(20, ErrorMessage = "El número telefónico no puede exceder 20 caracteres.")]
        [RegularExpression(@"^[0-9]+$", ErrorMessage = "El número telefónico solo puede contener números.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Range(0, 120, ErrorMessage = "La edad debe estar entre 0 y 120.")]
        public int Age { get; set; }

        [StringLength(250, ErrorMessage = "La dirección no puede exceder 250 caracteres.")]
        public string? Address { get; set; }

        [StringLength(500, ErrorMessage = "La URL de la foto no puede exceder 500 caracteres.")]
        public string? PhotoUrl { get; set; }

        // ============================
        // USER
        // ============================

        [Required]
        [StringLength(100, ErrorMessage = "El nombre de usuario no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9._-]+$", ErrorMessage = "El username solo puede contener letras, números, puntos, guiones y guiones bajos.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe seleccionar un rol.")]
        [Range(1, int.MaxValue, ErrorMessage = "RoleId debe ser un número válido mayor que 0.")]
        public int RoleId { get; set; }

        public bool IsActive { get; set; }

        // Solo se usa al crear
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9@#$%^&+=!._-]+$",
            ErrorMessage = "La contraseña contiene caracteres inválidos.")]
        public string? Password { get; set; }
    }
}
