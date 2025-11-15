using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UserServiceAPI.Common;
using UserServiceAPI.Data;
using UserServiceAPI.Dtos;
using UserServiceAPI.InterfaceService;
using UserServiceAPI.Models;

namespace UserServiceAPI.Service
{
    public class PersonService : IPersonService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IPasswordHasher<UserModel> _passwordHasher;

        public PersonService(AppDbContext context, IPasswordHasher<UserModel> passwordHasher)
        {
            _appDbContext = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<ApiResponse> RegisterAsync(UserPersonRequestDto dto)
        {
            try
            {
                // VALIDAR EXISTENCIA DE ROL
                var roleExists = await _appDbContext.Role
                    .AnyAsync(r => r.RoleId == dto.RoleId);

                if (!roleExists)
                {
                    return new ApiResponse
                    {
                        Code = 400,
                        Status = "error",
                        Message = $"El RoleId '{dto.RoleId}' no existe.",
                        Data = null
                    };
                }

                // VALIDACIÓN BÁSICA
                if (string.IsNullOrWhiteSpace(dto.Password))
                {
                    return new ApiResponse
                    {
                        Code = 400,
                        Status = "error",
                        Message = "La contraseña es obligatoria para el registro.",
                        Data = null
                    };
                }

                // VALIDAR EMAIL DUPLICADO
                var emailExists = await _appDbContext.Person
                    .AnyAsync(p => p.Email == dto.Email);

                if (emailExists)
                {
                    return new ApiResponse
                    {
                        Code = 400,
                        Status = "error",
                        Message = "El email ya se encuentra registrado.",
                        Data = null
                    };
                }

                // VALIDAR USERNAME DUPLICADO
                var userExists = await _appDbContext.Users
                    .AnyAsync(u => u.Username == dto.Username);

                if (userExists)
                {
                    return new ApiResponse
                    {
                        Code = 400,
                        Status = "error",
                        Message = "El nombre de usuario ya está en uso.",
                        Data = null
                    };
                }

                // SEPARAR DTOs INTERNOS 
                var personDto = new PersonInternalDto
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    CountryCode = dto.CountryCode,
                    PhoneNumber = dto.PhoneNumber,
                    Age = dto.Age,
                    Address = dto.Address,
                    PhotoUrl = dto.PhotoUrl
                };

                var userDto = new UserInternalDto
                {
                    Username = dto.Username,
                    RoleId = dto.RoleId,
                    IsActive = dto.IsActive,
                    Password = dto.Password
                };

                // MAPEAR PERSONMODEL
                var person = new PersonModel
                {
                    FirstName = personDto.FirstName,
                    LastName = personDto.LastName,
                    Email = personDto.Email,
                    CountryCode = personDto.CountryCode,
                    PhoneNumber = personDto.PhoneNumber,
                    Age = personDto.Age,
                    Address = personDto.Address,
                    PhotoUrl = personDto.PhotoUrl,
                    CreatedAt = DateTime.UtcNow
                };

                // AGREGAR PERSON Y GUARDAR PARA OBTENER PersonId
                _appDbContext.Person.Add(person);
                await _appDbContext.SaveChangesAsync();

                // CREAR USUARIO
                var user = new UserModel
                {
                    UserGuid = Guid.NewGuid(),
                    PersonId = person.PersonId,
                    Username = userDto.Username,
                    RoleId = userDto.RoleId,
                    IsActive = userDto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    PasswordSalt = ""
                };

                // GENERAR HASH DE CONTRASEÑA

                var hashedPassword = _passwordHasher.HashPassword(user, userDto.Password!);

                // Guardamos el hash completo en PasswordHash
                // Como IPasswordHasher NO usa salt separado, lo incluimos todo en PasswordHash
                user.PasswordHash = hashedPassword;

                _appDbContext.Users.Add(user);
                await _appDbContext.SaveChangesAsync();

                // RESPUESTA DTO
                var responseDto = new UserPersonResponseDto
                {
                    UserGuid = user.UserGuid,
                    UserId = user.UserId,
                    Username = user.Username,
                    RoleId = user.RoleId,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,

                    PersonId = person.PersonId,
                    FirstName = person.FirstName,
                    LastName = person.LastName,
                    Email = person.Email,
                    CountryCode = person.CountryCode,
                    PhoneNumber = person.PhoneNumber,
                    Age = person.Age,
                    Address = person.Address,
                    PhotoUrl = person.PhotoUrl
                };

                return new ApiResponse
                {
                    Code = 200,
                    Status = "success",
                    Message = "Usuario registrado correctamente.",
                    Data = responseDto
                };

            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Message = ex.Message,
                    Status = "error",
                    Code = 500,
                    Data = null  // No se incluyen datos en 'Data'
                };
            }
        }

        public async Task<ApiResponse> UpdateAsync(Guid userGuid, UserPersonRequestDto dto)
        {
            try
            {
                // ----------- VALIDAR ROLE EXISTENTE
                var roleExists = await _appDbContext.Role
                    .AnyAsync(r => r.RoleId == dto.RoleId);

                if (!roleExists)
                {
                    return new ApiResponse
                    {
                        Code = 400,
                        Status = "error",
                        Message = $"El RoleId '{dto.RoleId}' no existe.",
                        Data = null
                    };
                }

                // ----------- BUSCAR USER POR GUID
                var user = await _appDbContext.Users
                    .FirstOrDefaultAsync(u => u.UserGuid == userGuid);

                if (user == null)
                {
                    return new ApiResponse
                    {
                        Code = 404,
                        Status = "error",
                        Message = "Usuario no encontrado.",
                        Data = null
                    };
                }

                // ----------- BUSCAR PERSONA
                var person = await _appDbContext.Person
                    .FirstOrDefaultAsync(p => p.PersonId == user.PersonId);

                if (person == null)
                {
                    return new ApiResponse
                    {
                        Code = 500,
                        Status = "error",
                        Message = "La persona asociada al usuario no existe.",
                        Data = null
                    };
                }

                // ----------- EMAIL DUPLICADO
                // ----------- EMAIL DUPLICADO
                var normalizedEmail = dto.Email.Trim().ToLower();

                var emailExists = await _appDbContext.Person
                    .AnyAsync(p =>
                        p.Email.ToLower() == normalizedEmail &&
                        p.PersonId != person.PersonId
                    );

                if (emailExists)
                {
                    return new ApiResponse
                    {
                        Code = 409,
                        Status = "error",
                        Message = $"El correo '{dto.Email}' ya existe.",
                        Data = null
                    };
                }


                // ----------- USERNAME DUPLICADO
                var usernameExists = await _appDbContext.Users
                    .AnyAsync(u => u.Username == dto.Username && u.UserId != user.UserId);

                if (usernameExists)
                {
                    return new ApiResponse
                    {
                        Code = 409,
                        Status = "error",
                        Message = $"El nombre de usuario '{dto.Username}' ya existe.",
                        Data = null
                    };
                }

                // ----------- INICIAR TRANSACCIÓN
                using var transaction = await _appDbContext.Database.BeginTransactionAsync();

                // ----------- ACTUALIZAR PERSON
                person.FirstName = dto.FirstName;
                person.LastName = dto.LastName;
                person.Email = normalizedEmail;
                person.CountryCode = dto.CountryCode;
                person.PhoneNumber = dto.PhoneNumber;
                person.Age = dto.Age;
                person.Address = dto.Address;
                person.PhotoUrl = dto.PhotoUrl;

                // ----------- ACTUALIZAR USER
                user.Username = dto.Username;
                user.RoleId = dto.RoleId;
                user.IsActive = dto.IsActive;

                await _appDbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                // ----------- ARMAR RESPUESTA
                var responseDto = new UserPersonResponseDto
                {
                    UserGuid = user.UserGuid,
                    UserId = user.UserId,
                    Username = user.Username,
                    RoleId = user.RoleId,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,

                    PersonId = person.PersonId,
                    FirstName = person.FirstName,
                    LastName = person.LastName,
                    Email = person.Email,
                    CountryCode = person.CountryCode,
                    PhoneNumber = person.PhoneNumber,
                    Age = person.Age,
                    Address = person.Address,
                    PhotoUrl = person.PhotoUrl
                };

                return new ApiResponse
                {
                    Code = 200,
                    Status = "success",
                    Message = "Usuario actualizado correctamente.",
                    Data = responseDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        public async Task<ApiResponse> GetByGuidAsync(Guid userGuid)
        {
            try
            {
                // Buscar el usuario con su relación Person y Role
                var user = await _appDbContext.Users
                    .Include(u => u.Person)
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserGuid == userGuid);

                if (user == null)
                {
                    return new ApiResponse
                    {
                        Code = 404,
                        Status = "error",
                        Message = "Usuario no encontrado.",
                        Data = null
                    };
                }

                // Mapear respuesta DTO
                var result = new UserPersonResponseDto
                {
                    // ----------- User 
                    UserId = user.UserId,
                    UserGuid = user.UserGuid,
                    Username = user.Username,
                    RoleId = user.RoleId,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,

                    // ----------- Person 
                    PersonId = user.PersonId,
                    FirstName = user.Person.FirstName,
                    LastName = user.Person.LastName,
                    Email = user.Person.Email,
                    CountryCode = user.Person.CountryCode,
                    PhoneNumber = user.Person.PhoneNumber,
                    Age = user.Person.Age,
                    Address = user.Person.Address,
                    PhotoUrl = user.Person.PhotoUrl
                };

                return new ApiResponse
                {
                    Code = 200,
                    Status = "success",
                    Message = "Usuario encontrado.",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        public async Task<ApiResponse> GetAllAsync(int page, int pageSize, string? firstName, string? lastName)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 10;

                // Base query con Includes
                var query = _appDbContext.Users
                    .Include(u => u.Person)
                    .Include(u => u.Role)
                    .AsQueryable();

                // FILTRO FIRSTNAME
                if (!string.IsNullOrWhiteSpace(firstName))
                {
                    query = query.Where(u => u.Person.FirstName.Contains(firstName));
                }

                // FILTRO LASTNAME
                if (!string.IsNullOrWhiteSpace(lastName))
                {
                    query = query.Where(u => u.Person.LastName.Contains(lastName));
                }

                // Total para paginación
                var totalRecords = await query.CountAsync();

                // Paginación
                var users = await query
                    .OrderBy(u => u.UserId) // orden determinístico
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Mapear DTO
                var result = users.Select(user => new UserPersonResponseDto
                {
                    // ==== User ====
                    UserId = user.UserId,
                    UserGuid = user.UserGuid,
                    Username = user.Username,
                    RoleId = user.RoleId,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,

                    // ==== Person ====
                    PersonId = user.PersonId,
                    FirstName = user.Person.FirstName,
                    LastName = user.Person.LastName,
                    Email = user.Person.Email,
                    CountryCode = user.Person.CountryCode,
                    PhoneNumber = user.Person.PhoneNumber,
                    Age = user.Person.Age,
                    Address = user.Person.Address,
                    PhotoUrl = user.Person.PhotoUrl

                }).ToList();

                // Estructura final con paginación
                var responseData = new
                {
                    page,
                    pageSize,
                    totalRecords,
                    totalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                    users = result
                };

                return new ApiResponse
                {
                    Code = 200,
                    Status = "success",
                    Message = "Usuarios obtenidos correctamente.",
                    Data = responseData
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        public async Task<ApiResponse> DeleteAsync(Guid userGuid)
        {
            try
            {
                Console.WriteLine("userGuid--->" + userGuid);
                // 1. Buscar el usuario por GUID
                var user = await _appDbContext.Users
                    .Include(u => u.Person)
                    .FirstOrDefaultAsync(u => u.UserGuid == userGuid);

                Console.WriteLine("user--->" + user);
                if (user == null)
                {
                    return new ApiResponse
                    {
                        Code = 404,
                        Status = "error",
                        Message = "Usuario no encontrado.",
                        Data = null
                    };
                }

                // 2. Eliminar dentro de una transacción
                using var transaction = await _appDbContext.Database.BeginTransactionAsync();

                try
                {
                    // Primero eliminar el usuario
                    _appDbContext.Users.Remove(user);
                    await _appDbContext.SaveChangesAsync();

                    // Luego eliminar la persona asociada
                    _appDbContext.Person.Remove(user.Person);
                    await _appDbContext.SaveChangesAsync();

                    // Commit final
                    await transaction.CommitAsync();
                }
                catch (Exception innerEx)
                {
                    await transaction.RollbackAsync();
                    return new ApiResponse
                    {
                        Code = 500,
                        Status = "error",
                        Message = "Error al eliminar el usuario: " + innerEx.Message,
                        Data = null
                    };
                }

                return new ApiResponse
                {
                    Code = 200,
                    Status = "success",
                    Message = "Usuario eliminado correctamente.",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                };
            }
        }


    }
}
