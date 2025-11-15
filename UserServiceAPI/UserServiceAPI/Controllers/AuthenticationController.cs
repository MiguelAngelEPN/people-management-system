using Microsoft.AspNetCore.Mvc;
using UserServiceAPI.Common;
using UserServiceAPI.Dtos;
using UserServiceAPI.InterfaceService;

namespace UserServiceAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : Controller
    {
        public readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost()]
        public async Task<IActionResult> LogIn([FromBody]LoginRequestDto dtoLogIn)
        {
            try
            {
                var response = await _authenticationService.LogIn(dtoLogIn);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponse
                {
                    Message = ex.Message,
                    Status = "error",
                    Code = 500,
                    Data = null  // No se incluyen datos en 'Data'
                };
                return StatusCode(500, response);
            }
        }

    }
}
