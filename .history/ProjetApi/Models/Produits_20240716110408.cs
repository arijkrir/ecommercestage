namespace ProjetApi.Models
{
    public class Produits
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;

        [NotMapped]
        public decimal OldPrice { get; set; }

        [NotMapped]
        public decimal PromoPrice { get; set; }
    }
}
