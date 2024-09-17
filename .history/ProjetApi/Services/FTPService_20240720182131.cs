using FluentFTP;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;

[HttpPost("UpdateProductQuantitiesFromCsv")]
public async Task<IActionResult> UpdateProductQuantitiesFromCsv()
{
    try
    {
        var ftpHost = "127.0.0.1"; 
        var ftpUsername = "arij"; // Remplacez par votre nom d'utilisateur FTP
        var ftpPassword = "arij"; // Remplacez par votre mot de passe FTP
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
        foreach (var product in _context.Produits)
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
