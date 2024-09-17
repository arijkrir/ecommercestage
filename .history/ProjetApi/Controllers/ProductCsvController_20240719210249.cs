using Microsoft.AspNetCore.Mvc;
using ProjetApi.Services;
using System.IO;

namespace ProjetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCsvController : ControllerBase
    {
        private readonly CsvWriterService _csvWriterService;

        public ProductCsvController(CsvWriterService csvWriterService)
        {
            _csvWriterService = csvWriterService;
        }

        [HttpGet("generate-csv")]
        public IActionResult GenerateCsv()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "productsqte.csv");

            // Appel de la méthode GenerateCsv pour générer le fichier
            _csvWriterService.GenerateCsv(filePath);

            return Ok(new { filePath });
        }
    }
}
