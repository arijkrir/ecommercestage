using System;
using System.IO;
using System.Text;

namespace ProjetApi.Services
{
    public class CsvWriterService
    {
        // Méthode pour générer un fichier CSV avec des quantités aléatoires
        public void GenerateCsv(string filePath)
        {
            var random = new Random();
            using (var writer = new StreamWriter(filePath, false, Encoding.UTF8))
            {
                writer.WriteLine("ID,Quantity");

                for (int id = 1; id <= 1000000; id++)
                {
                    int quantity = random.Next(1, 101);  // Quantité aléatoire entre 1 et 100
                    writer.WriteLine($"{id},{quantity}");
                }
            }
        }
    }
}
