// Controllers/UsersController.cs
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
        public async Task<User> CreateUserAsync(User user)
{
    try
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
    catch (Exception ex)
    {
        // Log the exception and rethrow
        // Log.Error("Error saving user", ex); // Assurez-vous d'utiliser un framework de journalisation
        throw;
    }
}

    }
}
