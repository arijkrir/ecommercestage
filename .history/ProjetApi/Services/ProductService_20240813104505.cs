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
            var topProducts = await _context.Articles
                .Include(a => a.Produit)  // Assurez-vous d'inclure la navigation vers Produits
                .GroupBy(a => a.ProduitId)
                .Select(g => new 
                {
                    ProduitId = g.Key,
                    QuantiteeTotale = g.Sum(a => a.QuantiteeCommandee)
                })
                .OrderByDescending(g => g.QuantiteeTotale)
                .Take(top)
                .Join(_context.Produits, g => g.ProduitId, p => p.Id, (g, p) => p)
                .ToListAsync();

            return topProducts;
        }
    }
}
