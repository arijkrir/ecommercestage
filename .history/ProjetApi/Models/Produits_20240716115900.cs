namespace ProjetApi.Models
{
    public partial class Produits
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public string Designation { get; set; }
        public string Image { get; set; } 
         oldPrice?: number; // Champ optionnel
  promoPrice?: number; // Champ optionnel
  quantity?: number; // Ajouté pour la gestion de la quantité

    }
}