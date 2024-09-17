using CsvHelper.Configuration;

public class ProductCsv
{
    public int Id { get; set; }
    public decimal OldPrice { get; set; }
    public decimal PromoPrice { get; set; }
}

public sealed class ProductCsvMap : ClassMap<ProductCsv>
{
    public ProductCsvMap()
    {
        Map(m => m.Id).Index(0).Name("Id");
        Map(m => m.OldPrice).Index(1).Name("OldPrice");
        Map(m => m.PromoPrice).Index(2).Name("PromoPrice");
    }
}
