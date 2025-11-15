using UserServiceAPI.Common;
using UserServiceAPI.Dtos;

namespace UserServiceAPI.InterfaceService
{
    public interface IPersonService
    {
        // Crear usuario + persona (POST /users)
        Task<ApiResponse> RegisterAsync(UserPersonRequestDto dto);

        // Actualizar usuario+persona por userGuid (PUT /users/{userGuid})
        Task<ApiResponse> UpdateAsync(Guid userGuid, UserPersonRequestDto dto);

        // Obtener usuario+persona por userGuid (GET /users/{userGuid})
        Task<ApiResponse> GetByGuidAsync(Guid userGuid);

        // Obtener todos (GET /users)
        Task<ApiResponse> GetAllAsync(int page, int pageSize, string? firstName, string? lastName);

        // Eliminar por userGuid (DELETE /users/{userGuid})
        Task<ApiResponse> DeleteAsync(Guid userGuid);
    }
}
