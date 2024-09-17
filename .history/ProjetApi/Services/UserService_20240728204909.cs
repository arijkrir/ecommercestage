using ProjetApi.Models;
using ProjetApi.Data;
using System.Threading.Tasks;

namespace ProjetApi.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

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
        // Log the exception and the inner exception
        // Example: Log.Error(ex, "Error creating user");
        throw new Exception($"Erreur lors de la création de l'utilisateur : {ex.Message}. Détails : {ex.InnerException?.Message}", ex);
    }
}

    }
}
