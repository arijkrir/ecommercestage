namespace ProjetApi.Models
{
    public class Produits
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public string Designation { get; set; }
        public string Image { get; set; }

        public float OldPrice? { get; set; }
        public float PromoPrice? { get; set; }
    }
}
