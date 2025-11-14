using Microsoft.AspNetCore.Mvc;
using UserServiceAPI.Common;
using UserServiceAPI.Dtos;
using UserServiceAPI.InterfaceService;

namespace UserServiceAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PersonController : Controller
    {
        public readonly IPersonService _personService;

        public PersonController(IPersonService personService)
        {
            this._personService = personService;
        }

        [HttpPost()]
        public async Task<IActionResult> RegisterAsync([FromBody]UserPersonRequestDto dto)
        {
            try
            {
                var response = await _personService.RegisterAsync(dto);
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
