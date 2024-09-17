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
// [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
//         {
//             if (loginRequest == null)
//             {
//                 return BadRequest("Les informations d'identification ne peuvent pas être nulles.");
//             }

//             var user = await _userService.AuthenticateUserAsync(loginRequest.EmailOrPhone, loginRequest.Password);

//             if (user == null)
//             {
//                 return Unauthorized("L'email/téléphone ou le mot de passe est incorrect.");
//             }

//             return Ok(user);
//         }
[HttpPost("login")]
public IActionResult Login([FromBody] LoginModel loginModel)
{
    if (!ModelState.IsValid)
    {
        return BadRequest("Invalid input.");
    }

    var token = _authService.Authenticate(loginModel);
    if (token == null)
    {
        return Unauthorized("Invalid credentials.");
    }

    return Ok(new { token });
}

    }
}

    public class LoginRequest
    {
        public string EmailOrPhone { get; set; }
        public string Password { get; set; }
    }

