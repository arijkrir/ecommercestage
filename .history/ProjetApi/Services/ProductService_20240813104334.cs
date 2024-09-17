using ProjetApi.Models;
using ProjetApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjetApi.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Méthode pour obtenir les produits les plus vendus
        public async Task<List<Produits>> GetTopProductsAsync(int top = 5)
        {
            return await _context.Produits
                .OrderByDescending(p => p.Orders.Sum(o => o.Quantity))  // Assurez-vous d'avoir une relation Orders dans Produits
                .Take(top)
                .ToListAsync();
        }
    }
}
