using FluentFTP;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using ProjetApi.Data; // Assurez-vous d'importer votre contexte de base de données
using ProjetApi.Models; // Assurez-vous d'importer vos modèles de données

[ApiController]
[Route("api/[controller]")]
public class FTPController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FTPController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("update-product-quantities")]
    public async Task<IActionResult> UpdateProductQuantitiesFromCsv()
    {
        try
        {
            var ftpHost = "127.0.0.1";
            var ftpUsername = "arij";
            var ftpPassword = "arij";
            var remoteFilePath = "/csv";

            var productQuantities = new Dictionary<int, int>();

            // Créer une connexion FTP
            using (var ftpClient = new FtpClient(ftpHost, ftpUsername, ftpPassword))
            {
                ftpClient.Connect();

                // Télécharger le fichier CSV en mémoire
                using (var stream = new MemoryStream())
                {
                    await ftpClient.DownloadAsync(stream, remoteFilePath);
                    stream.Position = 0; // Revenir au début du flux

                    using (var reader = new StreamReader(stream))
                    using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
                    {
                        var records = csv.GetRecords<ProductCsv>().ToList();

                        // Créez un dictionnaire pour stocker les quantités
                        foreach (var record in records)
                        {
                            productQuantities[record.Id] = record.Quantity;
                        }
                    }
                }

                ftpClient.Disconnect();
            }

            // Mettez à jour les quantités dans la base de données
            foreach (var product in _context.ProductCsv)
            {
                if (productQuantities.ContainsKey(product.Id))
                {
                    product.Quantity = productQuantities[product.Id];
                }
            }

            await _context.SaveChangesAsync();

            return Ok("Quantités mises à jour avec succès.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
        }
    }
}
