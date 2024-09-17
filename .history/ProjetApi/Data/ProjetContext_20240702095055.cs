using Microsoft.EntityFrameworkCore;
using ProjetBackend.Models;

namespace ProjetBackend.Data
{
    public class ProjetContext : DbContext
    {
        public ProjetContext(DbContextOptions<ProjetContext> options)
            : base(options)
        {
        }

        public DbSet<Produit> Produits { get; set; }
    }
}
