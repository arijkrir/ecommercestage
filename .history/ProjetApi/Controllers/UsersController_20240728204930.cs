using Microsoft.AspNetCore.Mvc;
using ProjetApi.Models;
using ProjetApi.Services;
using System.Threading.Tasks;

namespace ProjetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("create")]
public async Task<IActionResult> CreateUser([FromBody] User user)
{
    if (user == null)
    {
        return BadRequest("L'utilisateur ne peut pas être nul.");
    }

    try
    {
        var createdUser = await _userService.CreateUserAsync(user);
        return Ok(createdUser);
    }
    catch (Exception ex)
    {
        // Log the exception and the inner exception
        // For example, use a logging framework
        // Log.Error(ex, "Error creating user");

        // Return a generic error message with details
        return StatusCode(500, $"Erreur lors de la création de l'utilisateur : {ex.Message}. Détails : {ex.InnerException?.Message}");
    }
}

    }
}
