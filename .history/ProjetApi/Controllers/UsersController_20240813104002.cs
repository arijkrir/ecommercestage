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
                return StatusCode(500, $"Erreur lors de la création de l'utilisateur : {ex.Message}. Détails : {ex.InnerException?.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (user == null || id != user.Id)
            {
                return BadRequest("Les données de l'utilisateur sont invalides.");
            }

            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, user);
                if (updatedUser == null)
                {
                    return NotFound("Utilisateur non trouvé.");
                }

                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de la mise à jour de l'utilisateur : {ex.Message}. Détails : {ex.InnerException?.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
            {
                return BadRequest("Les informations d'identification ne peuvent pas être nulles.");
            }

            var user = await _userService.AuthenticateUserAsync(loginRequest.EmailOrPhone, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized("L'email/téléphone ou le mot de passe est incorrect.");
            }

            return Ok(new { token = "fake-jwt-token", user });
        }
         // Méthode pour obtenir les clients qui achètent le plus
        public async Task<List<User>> GetTopClientsAsync(int top = 5)
        {
            return await _context.Users
                .OrderByDescending(u => u.Orders.Count)  // Assurez-vous d'avoir une relation Orders dans User
                .Take(top)
                .ToListAsync();
        }

        // Méthode pour obtenir la ville avec le plus d'achats
        public async Task<string> GetTopCityAsync()
        {
            return await _context.Users
                .GroupBy(u => u.Ville)
                .OrderByDescending(g => g.Sum(u => u.Orders.Count))
                .Select(g => g.Key)
                .FirstOrDefaultAsync();
        }
    }

    public class LoginRequest
    {
        public string EmailOrPhone { get; set; }
        public string Password { get; set; }
    }
}
