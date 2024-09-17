using Microsoft.AspNetCore.Mvc;
using ProjetApi.Services;
using System.Threading.Tasks;

namespace ProjetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ProduitService _productService;

        public StatisticsController(UserService userService, ProductService productService)
        {
            _userService = userService;
            _productService = productService;
        }

        [HttpGet("top-clients")]
        public async Task<IActionResult> GetTopClients()
        {
            var topClients = await _userService.GetTopClientsAsync();
            return Ok(topClients);
        }

        [HttpGet("top-city")]
        public async Task<IActionResult> GetTopCity()
        {
            var topCity = await _userService.GetTopCityAsync();
            return Ok(topCity);
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts()
        {
            var topProducts = await _productService.GetTopProductsAsync();
            return Ok(topProducts);
        }
    }
}
