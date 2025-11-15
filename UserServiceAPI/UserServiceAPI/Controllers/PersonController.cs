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

        [HttpPut("{userGuid}")]
        public async Task<IActionResult> UpdateAsync([FromRoute]Guid userGuid, [FromBody]UserPersonRequestDto dto)
        {
            try
            {
                var response = await _personService.UpdateAsync(userGuid, dto);
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

        [HttpGet("{userGuid}")]
        public async Task<IActionResult> GetByGuidAsync([FromRoute] Guid userGuid)
        {
            try
            {
                var response = await _personService.GetByGuidAsync(userGuid);
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

        [HttpGet]
        public async Task<IActionResult> GetAllAsync(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? firstName = null,
            [FromQuery] string? lastName = null)
        {
            try
            {
                var response = await _personService.GetAllAsync(page, pageSize, firstName, lastName);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                });
            }
        }

        [HttpDelete()]
        public async Task<IActionResult> DeleteAsync([FromRoute]Guid userGuid)
        {
            try
            {
                var response = await _personService.DeleteAsync(userGuid);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    Code = 500,
                    Status = "error",
                    Message = ex.Message,
                    Data = null
                });
            }
        }

    }
}
