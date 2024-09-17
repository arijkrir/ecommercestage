using Microsoft.EntityFrameworkCore;

namespace ProjetApi.Models
{
    public class ProjetContext : DbContext
    {
        public ProjetContext(DbContextOptions<ProjetContext> options) : base(options)
        {
        }

        public DbSet<Produit> Produits { get; set; }
        // Ajoutez d'autres DbSet pour d'autres entités si nécessaire
    }
}
