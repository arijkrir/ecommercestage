using Microsoft.AspNetCore.Mvc;
using ProjetApi.Services;
using System.IO;

namespace ProjetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCsvController : ControllerBase
    {
        private readonly ProductCsvService _productCsvService;
        private readonly CsvWriterService _csvWriterService;

        public ProductCsvController(ProductCsvService productCsvService, CsvWriterService csvWriterService)
        {
            _productCsvService = productCsvService;
            _csvWriterService = csvWriterService;
        }

        [HttpGet("generate-csv")]
        public IActionResult GenerateCsv()
        {
            const int numberOfProducts = 1000000; 
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "products.csv");

            var products = _productCsvService.GenerateProducts(numberOfProducts);
            _csvWriterService.WriteProductsToCsv(filePath, products);

            return Ok(new { filePath });
        }
    }
}
