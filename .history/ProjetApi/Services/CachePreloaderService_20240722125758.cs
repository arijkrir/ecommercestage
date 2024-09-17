using Microsoft.Extensions.Caching.Memory;
using FluentFTP;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using ProjetApi.Models;
using System.IO;
using System.Linq;

public class CachePreloaderService
{
    private readonly IMemoryCache _cache;
    private readonly string _ftpHost = "127.0.0.1";
    private readonly string _ftpUsername = "arij";
    private readonly string _ftpPassword = "arij";
    private readonly string _remoteFilePath = "/csv/qte.csv";

    public CachePreloaderService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public void PreloadCache()
    {
        var cacheKey = "ProductQuantities";

        if (!_cache.TryGetValue(cacheKey, out List<ProduitFTP> productQuantities))
        {
            productQuantities = new List<ProduitFTP>();

            using (var ftpClient = new FtpClient(_ftpHost, _ftpUsername, _ftpPassword))
            {
                ftpClient.Connect();

                var localFilePath = Path.GetTempFileName();

                // Download file synchronously
                ftpClient.DownloadFile(localFilePath, _remoteFilePath);

                using (var fileStream = new FileStream(localFilePath, FileMode.Open))
                using (var reader = new StreamReader(fileStream))
                using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
                {
                    var records = csv.GetRecords<ProduitFTP>().ToList();
                    productQuantities = records.ToList();
                }

                // Clean up temporary file
                System.IO.File.Delete(localFilePath);

                ftpClient.Disconnect();
            }

            // Cache the data with a relative expiration time
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(1));

            _cache.Set(cacheKey, productQuantities, cacheEntryOptions);
        }
    }
}
