using Microsoft.EntityFrameworkCore;
using ProjetApi.Models;
namespace ProjetApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Produits> Produits { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Commande> Commandes { get; set; }
        public DbSet<Article> Articles { get; set; }
    }
}
