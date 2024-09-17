using Microsoft.EntityFrameworkCore;

namespace ProjetApi.Models
{
    public class ProjetContext : DbContext
    {
        public ProjetContext(DbContextOptions<ProjetContext> options) : base(options)
        {
        }

        public DbSet<Produits> Produits { get; set; }
    }
}
