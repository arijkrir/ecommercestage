// ProjetApi/Services/ProductCsvService.cs

using ProjetApi.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ProjetApi.Services
{
    public class ProductCsvServiceRead
    {
        private readonly string _csvFilePath = @"C:\Users\arijk\Desktop\ecommerce stage\frontend\src\assets\products.csv";

        public List<ProductCsv> GetAllProductsFromCsv()
        {
            var products = new List<ProductCsv>();

            using (var reader = new StreamReader(_csvFilePath))
            {
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(',');

                    if (values.Length >= 3 && int.TryParse(values[0], out int id) && decimal.TryParse(values[1], out decimal oldPrice) && decimal.TryParse(values[2], out decimal promoPrice))
                    {
                        var product = new ProductCsv
                        {
                            Id = id,
                            OldPrice = oldPrice,
                            PromoPrice = promoPrice
                        };

                        products.Add(product);
                    }
                }
            }

            return products;
        }
    }
}
