using CsvHelper.Configuration;
using ProjetApi.Models;

namespace ProjetApi.Configurations
{
    public class CsvHelperConfiguration : ClassMap<Product>
    {
        public CsvHelperConfiguration()
        {
            Map(m => m.Id).Name("Id");
            Map(m => m.OldPrice).Name("OldPrice");
            Map(m => m.PromoPrice).Name("PromoPrice");
        }
    }
}
