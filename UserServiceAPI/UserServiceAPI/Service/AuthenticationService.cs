using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UserServiceAPI.Common;
using UserServiceAPI.Data;
using UserServiceAPI.Dtos;
using UserServiceAPI.InterfaceService;
using UserServiceAPI.Models;

namespace UserServiceAPI.Service
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<UserModel> _passwordHasher;
        public AuthenticationService(
            AppDbContext db,
            IConfiguration config,
            IPasswordHasher<UserModel> passwordHasher)
        {
            _db = db;
            _config = config;
            _passwordHasher = passwordHasher;
        }


        public async Task<ApiResponse> LogIn(LoginRequestDto dtoLogIn)
        {
            // 1. Buscar persona por email
            var person = await _db.Person
                .FirstOrDefaultAsync(p => p.Email == dtoLogIn.Email);

            if (person == null)
            {
                return new ApiResponse
                {
                    Code = 400,
                    Status = "error",
                    Message = "Email o contraseña incorrectos",
                    Data = null
                };
            }

            // 2. Buscar usuario vinculado
            var user = await _db.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(u => u.PersonId == person.PersonId);

            if (user == null)
            {
                return new ApiResponse
                {
                    Code = 400,
                    Status = "error",
                    Message = "Email o contraseña incorrectos",
                    Data = null
                };
            }

            // 3. Convertir hash guardado a string
            string storedHash = user.PasswordHash;

            // 4. Verificar contraseña usando Identity
            var result = _passwordHasher.VerifyHashedPassword(
                user,
                storedHash,
                dtoLogIn.Password
            );

            if (result == PasswordVerificationResult.Failed)
            {
                return new ApiResponse
                {
                    Code = 400,
                    Status = "error",
                    Message = "Email o contraseña incorrectos",
                    Data = null
                };
            }

            // 5. Validar si está activo
            if (!user.IsActive)
            {
                return new ApiResponse
                {
                    Code = 403,
                    Status = "error",
                    Message = "El usuario está inactivo.",
                    Data = null
                };
            }

            // 6. Generar JWT
            string token = GenerateJwt(user);

            // 7. Construir DTO de salida
            var data = new LoginResponseDtocs
            {
                UserGuid = user.UserGuid,
                Username = user.Username,
                Email = person.Email,
                Role = user.Role.RoleName,
                Token = token
            };

            // 8. Retornar respuesta final
            return new ApiResponse
            {
                Code = 200,
                Status = "success",
                Message = "Inicio de sesión exitoso.",
                Data = data
            };
        }

        private string GenerateJwt(UserModel user)
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim("UserGuid", user.UserGuid.ToString()),
                new Claim("Username", user.Username),
                new Claim("IsActive", user.IsActive.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
