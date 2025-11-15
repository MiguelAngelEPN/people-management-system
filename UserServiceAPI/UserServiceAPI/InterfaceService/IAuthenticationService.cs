using UserServiceAPI.Common;
using UserServiceAPI.Dtos;

namespace UserServiceAPI.InterfaceService
{
    public interface IAuthenticationService
    {
        Task<ApiResponse> LogIn(LoginRequestDto dtoLogIn);
    }
}
