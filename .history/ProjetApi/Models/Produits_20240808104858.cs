namespace ProjetApi.Models
{
    public class Produits
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public string Designation { get; set; }
        public string Image { get; set; }
        public decimal Prix { get; set; } // Add this line

    }
}
