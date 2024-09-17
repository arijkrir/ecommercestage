using System;
using System.Collections.Generic;
using ProjetApi.Models;

namespace ProjetApi.Services
{
    public class ProductCsvService
    {
        public List<ProductCsv> GenerateProducts(int count)
        {
            var products = new List<ProductCsv>();
            var random = new Random();

            for (int i = 1000; i <= count; i++)
            {
                var oldPrice = (decimal)(random.NextDouble() * 1000);
                var promoPrice = oldPrice * (decimal)(random.NextDouble() * 0.9 + 0.1); // Prix promo entre 10% et 100% du prix initial
                products.Add(new ProductCsv { Id = i, OldPrice = oldPrice, PromoPrice = promoPrice });
            }

            return products;
        }
    }
}
