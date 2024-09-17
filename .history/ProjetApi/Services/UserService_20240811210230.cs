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

         public async Task<User> UpdateUserAsync(int id, User user, string newPassword = null)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return null; // Utilisateur non trouvé
                }

                // Mettez à jour les informations de l'utilisateur
                existingUser.Nom = user.Nom;
                existingUser.Prenom = user.Prenom;
                existingUser.Ville = user.Ville;
                existingUser.CodePostal = user.CodePostal;
                existingUser.Telephone = user.Telephone;
                existingUser.Email = user.Email;

                // Mettez à jour le mot de passe uniquement si un nouveau mot de passe est fourni
                if (!string.IsNullOrEmpty(newPassword))
                {
                    existingUser.MotdePasse = HashPassword(newPassword); // Méthode pour chiffrer le mot de passe
                }

                _context.Users.Update(existingUser);
                await _context.SaveChangesAsync();
                return existingUser;
            }
            catch (Exception ex)
            {
                // Log the exception and the inner exception
                throw new Exception($"Erreur lors de la mise à jour de l'utilisateur : {ex.Message}. Détails : {ex.InnerException?.Message}", ex);
            }
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }

    }

