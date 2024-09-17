using FluentFTP;
using Microsoft.AspNetCore.Mvc;
using ProjetApi.Models;
using ProjetApi.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.IO;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;


namespace ProjetApi.Controllers
{
    [Route("api/produits")]
    [ApiController]
   public class ProduitsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;

        public ProduitsController(ApplicationDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        // Endpoint to retrieve a product by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Produits>> GetProduit(int id)
        {
            var produit = await _context.Produits.FindAsync(id);

            if (produit == null)
            {
                return NotFound();
            }

            return produit;
        }

        // Endpoint to retrieve products one by one by their IDs
        [HttpGet("byIds")]
        public async Task<ActionResult<IEnumerable<Produits>>> GetProduitsByIds([FromQuery] List<int> ids)
        {
            var produits = await _context.Produits
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();

            if (produits == null || produits.Count == 0)
            {
                return NotFound();
            }

            return produits;
        }

        // Endpoint to retrieve all products
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Produits>>> GetAllProduits()
        {
            var produits = await _context.Produits.ToListAsync();

            if (produits == null || produits.Count == 0)
            {
                return NotFound();
            }

            return produits;
        }

        // Endpoint to retrieve paged product IDs
        [HttpGet("ids")]
        public async Task<ActionResult<IEnumerable<int>>> GetProduitIds(int pageNumber, int pageSize)
        {
            var ids = await _context.Produits
                .OrderBy(p => p.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => p.Id)
                .ToListAsync();

            if (ids == null || ids.Count == 0)
            {
                return NotFound();
            }

            return ids;
        }

        // Endpoint to retrieve product details by IDs
        [HttpPost("GetProductDetailsByIds")]
        public async Task<ActionResult<IEnumerable<Produits>>> GetProductDetailsByIds(List<int> ids)
        {
            var produits = await _context.Produits
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();

            if (produits == null || produits.Count == 0)
            {
                return NotFound();
            }

            return produits;
        }

        // Endpoint to retrieve product IDs with offset pagination
        [HttpGet("GetProductsIds")]
public async Task<ActionResult<IEnumerable<int>>> GetProductIds([FromQuery] int offset , [FromQuery] int limit )
        {
            var ids = await _context.Produits
                .OrderBy(p => p.Id)
                .Skip(offset)
                .Take(limit)
                .Select(p => p.Id)
                .ToListAsync();

            return ids;
        }



  [HttpPost("GetProductSDetailsByIds")]
public async Task<ActionResult<IEnumerable<Produits>>> GetProductsByIds([FromBody] List<int> ids)
{var products = await _context.Produits.Where(p => ids.Contains(p.Id)).ToListAsync();
return products;
}
 // Add this to ProduitsController
 [HttpPost("GetProductDetailsFromCsvByIds")]
    public async Task<ActionResult<IEnumerable<ProductCsv>>> GetProductDetailsFromCsvByIds([FromBody] List<int> ids)
    {
        try
        {
            var cacheKey = "ProductCsvCache";
            var cachedData = await _cache.GetStringAsync(cacheKey);

            List<ProductCsv> productCsvList;

            if (string.IsNullOrEmpty(cachedData))
            {
                var path = @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";
                productCsvList = new List<ProductCsv>();

                using (var reader = new StreamReader(path))
                using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
                {
                    var records = csv.GetRecords<ProductCsv>().ToList();
                    productCsvList = records.ToList();
                }

                var cacheEntryOptions = new DistributedCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromHours(1));

                var serializedData = JsonConvert.SerializeObject(productCsvList);
                await _cache.SetStringAsync(cacheKey, serializedData, cacheEntryOptions);
            }
            else
            {
                productCsvList = JsonConvert.DeserializeObject<List<ProductCsv>>(cachedData);
            }

            var filteredProducts = productCsvList.Where(r => ids.Contains(r.Id)).ToList();

            if (filteredProducts == null || filteredProducts.Count == 0)
            {
                return NotFound("No products found for the given IDs.");
            }

            return Ok(filteredProducts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

// [HttpPost("GetProductDetailsFromFTPByIds")]
// public ActionResult<IEnumerable<ProduitFTP>> GetProductDetailsFromFTPByIds([FromBody] List<int> ids)
// {
//     try
//     {
//         var ftpHost = "127.0.0.1";
//         var ftpUsername = "arij";
//         var ftpPassword = "arij";
//         var remoteFilePath = "/csv/qte.csv";
        
//         var productQuantities = new List<ProduitFTP>();

//         using (var ftpClient = new FtpClient(ftpHost, ftpUsername, ftpPassword))
//         {
//             ftpClient.Connect();

//             var localFilePath = Path.GetTempFileName();

//             // Download file synchronously
//             ftpClient.DownloadFile(localFilePath, remoteFilePath);

//             using (var fileStream = new FileStream(localFilePath, FileMode.Open))
//             using (var reader = new StreamReader(fileStream))
//             using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
//             {
//                 var records = csv.GetRecords<ProduitFTP>().ToList();
//                 productQuantities = records.Where(r => ids.Contains(r.ID)).ToList();
//             }

//             // Clean up temporary file
//             System.IO.File.Delete(localFilePath);

//             ftpClient.Disconnect();
//         }

//         if (productQuantities == null || productQuantities.Count == 0)
//         {
//             return NotFound("No products found for the given IDs.");
//         }

//         return Ok(productQuantities);
//     }
//     catch (Exception ex)
//     {
//         return StatusCode(500, $"Internal server error: {ex.Message}");
//     }
// }

 [HttpPost("GetProductDetailsFromFTPByIds")]
public async Task<ActionResult<IEnumerable<ProduitFTP>>> GetProductDetailsFromFTPByIds([FromBody] List<int> ids)
{
    try
    {
        var cacheKey = "ProductQuantities";
        var cachedData = await _cache.GetStringAsync(cacheKey);

        List<ProduitFTP> productQuantities;

        if (string.IsNullOrEmpty(cachedData))
        {
            var ftpHost = "127.0.0.1";
            var ftpUsername = "arij";
            var ftpPassword = "arij";
            var remoteFilePath = "/csv/quantity.csv";

            productQuantities = new List<ProduitFTP>();

            using (var ftpClient = new FtpClient(ftpHost, ftpUsername, ftpPassword))
            {
                        ftpClient.Connect();

                var localFilePath = Path.GetTempFileName();

                        // Download file synchronously
                        ftpClient.DownloadFile(localFilePath, remoteFilePath);

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

            var cacheEntryOptions = new DistributedCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(1));

            var serializedData = JsonConvert.SerializeObject(productQuantities);
            await _cache.SetStringAsync(cacheKey, serializedData, cacheEntryOptions);
        }
        else
        {
            productQuantities = JsonConvert.DeserializeObject<List<ProduitFTP>>(cachedData);
        }

        var filteredProducts = productQuantities.Where(r => ids.Contains(r.ID)).ToList();

        if (filteredProducts == null || filteredProducts.Count == 0)
        {
            return NotFound("No products found for the given IDs.");
        }

        return Ok(filteredProducts);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


[HttpPost("search-ids")]
public async Task<ActionResult<List<int>>> SearchProductIds([FromBody] SearchRequest request)
{
    if (request.Page <= 0 || request.PageSize <= 0)
    {
        return BadRequest("Page and PageSize must be greater than zero.");
    }

    // Convertir le terme de recherche en minuscules pour une comparaison insensible à la casse
    var searchTermLower = request.SearchTerm?.ToLower();

    // Requête pour obtenir les IDs des produits correspondant au terme de recherche
    var productIds = await _context.Produits
        .Where(p => (string.IsNullOrEmpty(searchTermLower) ||
                     p.Reference.ToLower().Contains(searchTermLower) ||
                     p.Designation.ToLower().Contains(searchTermLower)))
        .OrderBy(p => p.Id)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(p => p.Id)
        .ToListAsync();

    if (!productIds.Any())
    {
        return Ok(new List<int>());
    }

    return Ok(productIds);
}
[HttpPost("search-with-details")]
public async Task<ActionResult<IEnumerable<Produits>>> SearchProductsWithDetails([FromBody] SearchRequest request)
{
    if (request.Page <= 0 || request.PageSize <= 0)
    {
        return BadRequest("Page and PageSize must be greater than zero.");
    }

    // Convertir le terme de recherche en minuscules pour une comparaison insensible à la casse
    var searchTermLower = request.SearchTerm?.ToLower();

    // Requête pour obtenir les IDs des produits correspondant au terme de recherche
    var productIds = await _context.Produits
        .Where(p => (string.IsNullOrEmpty(searchTermLower) ||
                     p.Reference.ToLower().Contains(searchTermLower) ||
                     p.Designation.ToLower().Contains(searchTermLower)))
        .OrderBy(p => p.Id)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(p => p.Id)
        .ToListAsync();

    if (!productIds.Any())
    {
        return Ok(new List<Produits>());
    }

    // Appeler l'endpoint pour récupérer les détails des produits avec ces IDs
    var produits = await _context.Produits
        .Where(p => productIds.Contains(p.Id))
        .ToListAsync();

    if (produits == null || produits.Count == 0)
    {
        return NotFound();
    }

    return Ok(produits);
}
[HttpPost("search-csv-details")]
public ActionResult<IEnumerable<ProductCsv>> SearchCsvDetails([FromBody] SearchRequest request)
{
    if (request.Page <= 0 || request.PageSize <= 0)
    {
        return BadRequest("Page and PageSize must be greater than zero.");
    }

    // Convertir le terme de recherche en minuscules pour une comparaison insensible à la casse
    var searchTermLower = request.SearchTerm?.ToLower();

    // Requête pour obtenir les IDs des produits correspondant au terme de recherche
    var productIds = _context.Produits
        .Where(p => (string.IsNullOrEmpty(searchTermLower) ||
                     p.Reference.ToLower().Contains(searchTermLower) ||
                     p.Designation.ToLower().Contains(searchTermLower)))
        .OrderBy(p => p.Id)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(p => p.Id)
        .ToList();

    if (!productIds.Any())
    {
        return Ok(new List<ProductCsv>());
    }

    try
    {
        var path = @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";
        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
        {
            var records = csv.GetRecords<ProductCsv>().ToList();
            var products = records.Where(r => productIds.Contains(r.Id)).ToList();

            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            return Ok(products);
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


[HttpPost("search-ftp-details")]
public async Task<ActionResult<IEnumerable<ProduitFTP>>> SearchFtpDetails([FromBody] SearchRequest request)
{
    if (request.Page <= 0 || request.PageSize <= 0)
    {
        return BadRequest("Page and PageSize must be greater than zero.");
    }

    // Convertir le terme de recherche en minuscules pour une comparaison insensible à la casse
    var searchTermLower = request.SearchTerm?.ToLower();

    // Requête pour obtenir les IDs des produits correspondant au terme de recherche
    var productIds = await _context.Produits
        .Where(p => (string.IsNullOrEmpty(searchTermLower) ||
                     p.Reference.ToLower().Contains(searchTermLower) ||
                     p.Designation.ToLower().Contains(searchTermLower)))
        .OrderBy(p => p.Id)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(p => p.Id)
        .ToListAsync();

    if (!productIds.Any())
    {
        return Ok(new List<ProduitFTP>());
    }

    try
    {
        var cacheKey = "ProductQuantities";
        var cachedData = await _cache.GetStringAsync(cacheKey);

        List<ProduitFTP> productQuantities;

        if (string.IsNullOrEmpty(cachedData))
        {
            var ftpHost = "127.0.0.1";
            var ftpUsername = "arij";
            var ftpPassword = "arij";
            var remoteFilePath = "/csv/quantity.csv";

            productQuantities = new List<ProduitFTP>();

            using (var ftpClient = new FtpClient(ftpHost, ftpUsername, ftpPassword))
            {
                ftpClient.Connect();

                var localFilePath = Path.GetTempFileName();

                // Download file synchronously
                ftpClient.DownloadFile(localFilePath, remoteFilePath);

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

            var cacheEntryOptions = new DistributedCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(1));

            var serializedData = JsonConvert.SerializeObject(productQuantities);
            await _cache.SetStringAsync(cacheKey, serializedData, cacheEntryOptions);
        }
        else
        {
            productQuantities = JsonConvert.DeserializeObject<List<ProduitFTP>>(cachedData);
        }

        var filteredProducts = productQuantities.Where(r => productIds.Contains(r.ID)).ToList();

        if (filteredProducts == null || filteredProducts.Count == 0)
        {
            return NotFound("No products found for the given IDs.");
        }

        return Ok(filteredProducts);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


    
       // Endpoint to add massive products with random images// 
        [HttpPost("add-massive-products")]
        public async Task<IActionResult> AddMassiveProducts()
        {
            var random = new Random();
            var images = new List<string>
            {
                "HD_Smart_Small_Projector.jpg","51N2hUP7+pL._SL1500_.jpg","61-H2fFdM1L._SL1500_.jpg",
                "51bn3oFzysL._SL1500_.jpg","61-K2lXmHQL._AC_SL1500_.jpg","61Di8duRsJL._SL1200_.jpg",
                "61gKkYQn6lL._AC_SL1500_.jpg","61IfJQTeRuL._AC_SL1500_.jpg","61IW-8gE8CL._AC_SL1000_.jpg",
                "61jYs6d0aUL._AC_SL1500_.jpg","61K6cQhw4EL._SL1500_.jpg","61KedtnoewL._SL1500_.jpg",
                "61UGUXvwnnL._SL1500_.jpg","61wd3vtedaL._SL1500_.jpg","61YQeAUIboL._AC_SL1500_.jpg",
                "61Yupm5970L._AC_SL1200_.jpg","71+8ct7NbAL._AC_SL1500_.jpg","71+8uTMDRFL._AC_SL1500_.jpg",
                "71cQa9CUS0L._SL1420_.jpg","71dzwr2VOzL._SL1500_.jpg","71iJfJSDcQL._SL1500_.jpg",
                "71LCmvrndjL._AC_SL1500_.jpg","71MQo8pHmBL._SL1500_.jpg","71NEfdX5eSL._SL1500_.jpg",
                "71QN5UjfFRL._AC_SL1500_.jpg","71UwRqtlo7L._AC_SL1500_.jpg","71XR3lo00cL._AC_SL1500_.jpg",
                "81A6emwYQGL._AC_SL1500_.jpg","81ckNCi05KL._SL1500_.jpg","81TI60TumXS._AC_SL1500_.jpg",
                "81YBjPyXy1L._AC_SL1500_.jpg","91ZNEt0wTML._AC_SL1500_.jpg","513LvDOMTBL._AC_SL1500_.jpg",
                "613lBPFv93L._SL1500_.jpg","617z6N3l59L._AC_SL1500_.jpg","715o6bJfYmL._AC_SL1500_.jpg",
                "716YUdHaK0L._AC_SL1500_.jpg","810R6LO0ZeL._SL1500_.jpg","817Da7pNmfL._AC_SY695_.jpg",
                "apple-tv-4k-hero-select-202210_FMT_WHH.jpg","HkNQ4KtZvS6AFbGfXSns3V-1200-80.jpg"
            };

            for (int i =1015989; i < 100000000; i++)
            {
                var randomReference = "Ref-" + random.Next(10000, 999999999);
                var randomImageIndex = random.Next(images.Count);
                var produit = new Produits
                {
                    Designation = "Produit " + i,
                    Reference = randomReference,
                    Image = "/images/" + images[randomImageIndex]
                };

                _context.Produits.Add(produit);

                // Periodically save to avoid memory issues
                if (i % 10000 == 0)
                {
                    await _context.SaveChangesAsync();
                    _context.ChangeTracker.Clear(); // Free memory and reset ChangeTracker
                }
            }

            // Save remaining products
            await _context.SaveChangesAsync();

            return Ok("1000 produits ajoutés avec des images différentes.");
        }
    }

 public class SearchRequest
{
    public string SearchTerm { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
}
