using ProjetApi.Models;
using ProjetApi.Data; // Assurez-vous que ce namespace correspond à votre contexte de données
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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

        public async Task<User> AuthenticateUserAsync(string emailOrPhone, string password)
        {
            // Rechercher l'utilisateur avec l'email ou le téléphone
            var user = await _context.Users
                .FirstOrDefaultAsync(u => (u.Email == emailOrPhone || u.Telephone == emailOrPhone) && u.MotdePasse == password);

            return user;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}
