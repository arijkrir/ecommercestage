public class Commande
{
    public int Id { get; set; }
    public List<Article> Articles { get; set; }
    public int UserId { get; set; }
    public decimal PrixTotal { get; set; }
}

public class Article
    {
        [Key]
        public int ArticleId { get; set; }

        [Required]
        public int ProduitId { get; set; }

        [ForeignKey("ProduitId")]
        public Produit Produit { get; set; }

        [Required]
        public int Quantite { get; set; }

        [Required]
        public int CommandeId { get; set; }

        [ForeignKey("CommandeId")]
        public Commande Commande { get; set; }
    }
