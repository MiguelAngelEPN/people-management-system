using UserServiceAPI.Common;
using UserServiceAPI.Dtos;
using UserServiceAPI.InterfaceService;

namespace UserServiceAPI.Service
{
    public class PersonService : IPersonService
    {
        public Task<ApiResponse> RegisterAsync(UserPersonRequestDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> UpdateAsync(Guid userGuid, UserPersonRequestDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> GetByGuidAsync(Guid userGuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> DeleteAsync(Guid userGuid)
        {
            throw new NotImplementedException();
        }

    }
}
