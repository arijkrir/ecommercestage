namespace ProjetApi.Models
{
    public partial class Produits
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public string Designation { get; set; }
        public string Image { get; set; } 
         

    }

      public class ProductCsv
    {
        public int Id { get; set; }
        public decimal OldPrice { get; set; }
        public decimal PromoPrice { get; set; }
    }
}