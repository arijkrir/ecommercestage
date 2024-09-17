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
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration; // Assurez-vous d'avoir cette directive using




namespace ProjetApi.Controllers
{
    [Route("api/produits")]
    [ApiController]
   public class ProduitsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;
        private readonly IConfiguration _configuration;

        public ProduitsController(IConfiguration configuration,ApplicationDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
            _configuration = configuration;

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
public ActionResult<IEnumerable<ProductCsv>> GetProductDetailsFromCsvByIds([FromBody] List<int> ids)
{
    try
    {
        var path = @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";
        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
        {
            var records = csv.GetRecords<ProductCsv>().ToList();
            var products = records.Where(r => ids.Contains(r.Id)).ToList();

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

    var categories = new Dictionary<string, List<string>>
    {
        { "Electroniques", new List<string>
          {
              "61gKkYQn6lL._AC_SL1500_.jpg", "61IfJQTeRuL._AC_SL1500_.jpg", "61IW-8gE8CL._AC_SL1000_.jpg",
              "61jYs6d0aUL._AC_SL1500_.jpg", "61-K2lXmHQL._AC_SL1500_.jpg", "61YQeAUIboL._AC_SL1500_.jpg",
              "61Yupm5970L._AC_SL1200_.jpg", "71LCmvrndjL._AC_SL1500_.jpg", "71QN5UjfFRL._AC_SL1500_.jpg",
              "81TI60TumXS._AC_SL1500_.jpg", "715o6bJfYmL._AC_SL1500_.jpg", "817Da7pNmfL._AC_SY695_.jpg",
              "apple-tv-4k-hero-select-202210_FMT_WHH.jpg", "HD_Smart_Small_Projector.jpg", "HkNQ4KtZvS6AFbGfXSns3V-1200-80.jpg"
          }
        },
        { "Électroménagers", new List<string>
          {
              "61wd3vtedaL._SL1500_.jpg", "61Di8duRsJL._SL1200_.jpg", "71+8uTMDRFL._AC_SL1500_.jpg",
              "71NEfdX5eSL._SL1500_.jpg", "71UwRqtlo7L._AC_SL1500_.jpg", "81A6emwYQGL._AC_SL1500_.jpg",
              "513LvDOMTBL._AC_SL1500_.jpg", "613lBPFv93L._SL1500_.jpg"
          }
        },
        { "Beauty", new List<string>
          {
              "51bn3oFzysL._SL1500_.jpg", "51N2hUP7+pL._SL1500_.jpg", "61-H2fFdM1L._SL1500_.jpg",
              "61K6cQhw4EL._SL1500_.jpg", "61KedtnoewL._SL1500_.jpg", "61UGUXvwnnL._SL1500_.jpg",
              "71cQa9CUS0L._SL1420_.jpg", "71dzwr2VOzL._SL1500_.jpg", "71iJfJSDcQL._SL1500_.jpg",
              "71MQo8pHmBL._SL1500_.jpg", "81ckNCi05KL._SL1500_.jpg", "810R6LO0ZeL._SL1500_.jpg"
          }
        },
        { "Cuisine", new List<string>
          {
              "71+8ct7NbAL._AC_SL1500_.jpg", "71XR3lo00cL._AC_SL1500_.jpg", "71+8uTMDRFL._AC_SL1500_.jpg",
              "81A6emwYQGL._AC_SL1500_.jpg", "91ZNEt0wTML._AC_SL1500_.jpg", "617z6N3l59L._AC_SL1500_.jpg",
              "716YUdHaK0L._AC_SL1500_.jpg"
          }
        }
    };

    for (int i = 1; i <= 15000000; i++)
    {
        var randomReference = "Ref-" + random.Next(10000, 999999999);
        var randomImageIndex = random.Next(images.Count);
        var image = images[randomImageIndex];

        var category = categories.FirstOrDefault(c => c.Value.Contains(image)).Key ?? "Non catégorisé";

        var produit = new Produits
        {
            Designation = "Produit " + i,
            Reference = randomReference,
            Image = "/images/" + image,
            Categorie = category
        };

        _context.Produits.Add(produit);

        // Sauvegarde périodique
        if (i % 10000 == 0)
        {
            await _context.SaveChangesAsync();
            _context.ChangeTracker.Clear(); // Libération de la mémoire et réinitialisation du ChangeTracker
        }
    }

    // Sauvegarde des produits restants
    await _context.SaveChangesAsync();

    return Ok("10000 produits ajoutés avec des images différentes et catégories.");
}





[HttpPost("confirm")]
public async Task<IActionResult> ConfirmOrder([FromBody] OrderRequest orderRequest)
{
    if (orderRequest == null || orderRequest.Articles == null || !orderRequest.Articles.Any())
    {
        return BadRequest("Invalid order data.");
    }

    // Retrieve the user from the database
    var user = await _context.Users.FindAsync(orderRequest.UserId);
    if (user == null)
    {
        return NotFound("User not found.");
    }

    // Create a new order
    var commande = new Commande
    {
        UserId = orderRequest.UserId,
        PrixTotal = orderRequest.PrixTotal
    };

    // Add the order to the database
    _context.Commandes.Add(commande);
    await _context.SaveChangesAsync(); // Ensure the order is added

    // Add associated articles to the order
    foreach (var article in orderRequest.Articles)
    {
        var articleEntity = new Article
        {
            ProduitId = article.ProduitId,
            QuantiteeCommandee = article.QuantiteeCommandee,
            CommandeId = commande.CommandeId // Associate the article with the order
        };

        _context.Articles.Add(articleEntity);
    }

    // Save changes for the articles
    await _context.SaveChangesAsync();

    // Send a confirmation email
     await SendConfirmationEmail(user, orderRequest);

    return Ok(new { message = "Order confirmed successfully!" });
}

private async Task SendConfirmationEmail(User user, OrderRequest orderRequest)
{
    var smtpSettings = _configuration.GetSection("SmtpSettings").Get<SmtpSettings>();

    var fromAddress = new MailAddress(smtpSettings.Username, "Your E-Commerce Site");
    var toAddress = new MailAddress(user.Email, $"{user.Nom} {user.Prenom}");
    const string subject = "Order Confirmation";
    string body = $"Dear {user.Prenom},\n\n" +
                  "Thank you for your order! Here is the summary of your purchase:\n\n" +
                  $"Total Price: {orderRequest.PrixTotal:C}\n\n" +
                  "Items:\n";

    foreach (var article in orderRequest.Articles)
    {
        var product = await _context.Produits.FindAsync(article.ProduitId);
        if (product != null)
        {
            body += $"- {product.Designation}: {article.QuantiteeCommandee} \n";
        }
    }

    body += "\nYour products will be delivered in maximum 3 days \nThank you for shopping with us!\n\nBest regards,\nYour E-Commerce Team";

    var smtp = new SmtpClient
    {
        Host = smtpSettings.Host,
        Port = smtpSettings.Port,
        EnableSsl = smtpSettings.EnableSsl,
        DeliveryMethod = SmtpDeliveryMethod.Network,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(smtpSettings.Username, smtpSettings.Password)
    };

    using (var message = new MailMessage(fromAddress, toAddress)
    {
        Subject = subject,
        Body = body
    })
    {
        await smtp.SendMailAsync(message);
    }
}

[HttpPost("update-ftp-quantities")]
public async Task<IActionResult> UpdateFtpQuantities([FromBody] List<ProductUpdateRequest> productUpdates)
{
    try
    {
        var ftpHost = "127.0.0.1";
        var ftpUsername = "arij";
        var ftpPassword = "arij";
        var remoteFilePath = "/csv/quantity.csv";

        // Fetch the existing data from FTP
        List<ProduitFTP> productQuantities;

        using (var ftpClient = new FtpClient(ftpHost, ftpUsername, ftpPassword))
        {
            ftpClient.Connect();

            var localFilePath = Path.GetTempFileName();
            ftpClient.DownloadFile(localFilePath, remoteFilePath);

            using (var fileStream = new FileStream(localFilePath, FileMode.Open))
            using (var reader = new StreamReader(fileStream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
            {
                productQuantities = csv.GetRecords<ProduitFTP>().ToList();
            }

            // Update the quantities based on the incoming requests
            foreach (var update in productUpdates)
            {
                var product = productQuantities.FirstOrDefault(p => p.ID == update.Id);
                if (product != null)
                {
                    product.Quantity -= update.Quantity; // Subtract the ordered quantity
                }
            }

            // Write the updated data back to the CSV
            using (var writer = new StreamWriter(localFilePath))
            using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
            {
                csv.WriteRecords(productQuantities);
            }

            // Upload the updated file back to the FTP server
            ftpClient.UploadFile(localFilePath, remoteFilePath);

            // Clean up temporary file
            System.IO.File.Delete(localFilePath);

            ftpClient.Disconnect();
        }

        return Ok("Product quantities updated successfully.");
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


[HttpGet("GetCategoryProductsByIds/{category}")]
public async Task<ActionResult<IEnumerable<int>>> GetCategoryProductsByIds(string category, [FromQuery] int ofset, [FromQuery] int limi)
{
    if (ofset < 0 || limi <= 0)
    {
        return BadRequest("Offset must be non-negative and limit must be greater than 0.");
    }

    // Log pour vérifier la catégorie et les paramètres offset/limit
    // Console.WriteLine($"Category: {category}, Ofset: {ofset}, Limi: {limi}");

    var Cids = await _context.Produits
        .Where(p => p.Categorie == category)
        .OrderBy(p => p.Id)
        .Skip(ofset)
        .Take(limi)
        .Select(p => p.Id)
        .ToListAsync();

    // Log pour vérifier le résultat
    Console.WriteLine($"Retrieved {Cids.Count} product IDs");

    if (Cids == null || Cids.Count == 0)
    {
        return NotFound("No products found for the given category and pagination parameters.");
    }

    return Ok(Cids);
}


[HttpPost("GetCategoryProductDetailsByIds/{category}")]
public async Task<ActionResult<IEnumerable<Produits>>> GetCategoryProductDetailsByIds([FromBody] List<int> ids)
{var products = await _context.Produits.Where(p => ids.Contains(p.Id)).ToListAsync();
return products;
}



[HttpPost("GetCategoryProductDetailsFromCsvByIds/{category}")]
public ActionResult<IEnumerable<ProductCsv>> GetCategoryProductDetailsFromCsvByIds(string category, [FromBody] List<int> ids)
{
    try
    {
        var path =  @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";;
        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
        {
            var records = csv.GetRecords<ProductCsv>().ToList();
            var products = records.Where(r => ids.Contains(r.Id)).ToList();

            return Ok(products);
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

[HttpPost("GetCategoryProductDetailsFromFTPByIds/{category}")]
public async Task<ActionResult<IEnumerable<ProduitFTP>>> GetCategoryProductDetailsFromFTPByIds(string category, [FromBody] List<int> ids)
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


[HttpGet("GetUpsellingProducts")]
public async Task<ActionResult<IEnumerable<object>>> GetUpsellingProducts([FromQuery] int productId)
{
    // Récupérer le produit de référence depuis la base de données
    var selectedProduct = await _context.Produits.FindAsync(productId);
    if (selectedProduct == null)
    {
        return NotFound("Produit non trouvé");
    }

    // Lire les données du fichier CSV
    var path = @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";
    List<ProductCsv> csvProducts;

    try
    {
        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
        {
            csvProducts = csv.GetRecords<ProductCsv>().ToList();
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Erreur lors de la lecture du fichier CSV: {ex.Message}");
    }

    // Récupérer tous les produits avec la même image depuis la base de données
    var similarProductsFromDb = await _context.Produits
        .Where(p => p.Image == selectedProduct.Image)
        .ToListAsync();

    // Filtrer les produits ayant un prix supérieur dans le CSV
    var selectedProductCsv = csvProducts.FirstOrDefault(x => x.Id == productId);
    if (selectedProductCsv == null)
    {
        return NotFound("Produit non trouvé dans le fichier CSV");
    }

    var upsellingProducts = similarProductsFromDb
        .Join(csvProducts, 
              p => p.Id, 
              csv => csv.Id, 
              (p, csv) => new { Produit = p, Csv = csv })
        .Where(x => x.Csv.PromoPrice > selectedProductCsv.PromoPrice)
        .OrderByDescending(x => x.Csv.PromoPrice)
        .Take(5)
         .Select(x => new 
        {
            x.Produit.Id,
            x.Produit.Designation,
            x.Csv.PromoPrice,
            Image = x.Produit.Image 
        })
        .ToList();

    if (upsellingProducts.Count == 0)
    {
        return NotFound("Aucun produit upselling trouvé");
    }

    return Ok(upsellingProducts);
}


[HttpGet("GetCrossSellingProducts")]
public async Task<ActionResult<IEnumerable<object>>> GetCrossSellingProducts([FromQuery] int productId)
{
    // Récupérer le produit de référence depuis la base de données
    var selectedProduct = await _context.Produits.FindAsync(productId);
    if (selectedProduct == null)
    {
        return NotFound("Produit non trouvé");
    }

    // Définir les groupes d'images
    var group1 = new List<string> 
    {
        "/images/61gKkYQn6lL._AC_SL1500_.jpg",
        "/images/81TI60TumXS._AC_SL1500_.jpg",
        "/images/61Yupm5970L._AC_SL1200_.jpg",
        "/images/61YQeAUIboL._AC_SL1500_.jpg",
        "/images/817Da7pNmfL._AC_SY695_.jpg",
        "/images/71QN5UjfFRL._AC_SL1500_.jpg"
    };

    var group2 = new List<string>
    {
        "/images/51N2hUP7+pL._SL1500_.jpg",
        "/images/61UGUXvwnnL._SL1500_.jpg",
        "/images/51bn3oFzysL._SL1500_.jpg",
        "/images/61KedtnoewL._SL1500_.jpg",
        "/images/71MQo8pHmBL._SL1500_.jpg",
        "/images/81ckNCi05KL._SL1500_.jpg",
        "/images/71dzwr2VOzL._SL1500_.jpg",
        "/images/71cQa9CUS0L._SL1420_.jpg",
        "/images/810R6LO0ZeL._SL1500_.jpg"
    };

    var group3 = new List<string>
    {
        "/images/61Di8duRsJL._SL1200_.jpg",
        "/images/61IW-8gE8CL._AC_SL1000_.jpg",
        "/images/71NEfdX5eSL._SL1500_.jpg",
        "/images/61wd3vtedaL._SL1500_.jpg",
        "/images/513LvDOMTBL._AC_SL1500_.jpg",
        "/images/613lBPFv93L._SL1500_.jpg"
    };

    var group4 = new List<string>
    {
        "/images/71XR3lo00cL._AC_SL1500_.jpg",
        "/images/617z6N3l59L._AC_SL1500_.jpg",
        "/images/716YUdHaK0L._AC_SL1500_.jpg",
        "/images/91ZNEt0wTML._AC_SL1500_.jpg",
        "/images/81A6emwYQGL._AC_SL1500_.jpg",
        "/images/71+8uTMDRFL._AC_SL1500_.jpg",
        "/images/71+8ct7NbAL._AC_SL1500_.jpg"
    };

    // Assigner le groupe d'images au produit sélectionné
    List<string> selectedGroup = null;

    if (group1.Contains(selectedProduct.Image))
        selectedGroup = group1;
    else if (group2.Contains(selectedProduct.Image))
        selectedGroup = group2;
    else if (group3.Contains(selectedProduct.Image))
        selectedGroup = group3;
    else if (group4.Contains(selectedProduct.Image))
        selectedGroup = group4;

    if (selectedGroup == null)
    {
        return NotFound("Aucun groupe d'images trouvé pour ce produit");
    }

    // Lire les données du fichier CSV
    var path = @"C:\Users\arijk\Desktop\ecommercestage\ProjetApi\products.csv";
    List<ProductCsv> csvProducts;

    try
    {
        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = "," }))
        {
            csvProducts = csv.GetRecords<ProductCsv>().ToList();
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Erreur lors de la lecture du fichier CSV: {ex.Message}");
    }

    // Récupérer les produits du même groupe
    var upsellingProducts = await _context.Produits
        .Where(p => selectedGroup.Contains(p.Image) && p.Id != productId)
        .Join(csvProducts, 
              p => p.Id, 
              csv => csv.Id, 
              (p, csv) => new { Produit = p, Csv = csv })
        .OrderByDescending(x => x.Csv.PromoPrice)
        .Take(5)
        .Select(x => new 
        {
            x.Produit.Id,
            x.Produit.Designation,
            x.Csv.PromoPrice,
            Image = x.Produit.Image 
        })
        .ToListAsync();

    if (upsellingProducts.Count == 0)
    {
        return NotFound("Aucun produit upselling trouvé");
    }

    return Ok(upsellingProducts);
}

    }
    public class ProductUpdateRequest
{
    public int Id { get; set; }
    public int Quantity { get; set; }
}

public class SmtpSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public bool EnableSsl { get; set; }
}

public class OrderConfirmationDto
{
    public string UserName { get; set; }
    public string UserEmail { get; set; }
    public List<OrderItemDto> Items { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime DeliveryDate { get; set; }
}

public class OrderItemDto
{
    public string ProductName { get; set; }
    public int Quantity { get; set; }
}

public class OrderRequest
{
    public int UserId { get; set; }
    public decimal PrixTotal { get; set; }
    public List<ArticleRequest> Articles { get; set; }
}
public class ArticleRequest
{
    public int ProduitId { get; set; }
    public int QuantiteeCommandee { get; set; }
    public int CommandeId { get; set; }  // Add this property
}



 public class SearchRequest
{
    public string SearchTerm { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
    }
