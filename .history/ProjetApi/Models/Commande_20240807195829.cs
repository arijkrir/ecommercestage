using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetApi.Models
{
   public class Commande
{
    [Key]
    public int CommandeId { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    [Required]
    public decimal PrixTotal { get; set; }

    public ICollection<Article> Articles { get; set; }
}


    public class Article
{
    [Key]
    public int ArticleId { get; set; }

    [Required]
    public int ProduitId { get; set; }

    [ForeignKey("ProduitId")]
    public Produits Produit { get; set; }

    [Required]
    public int Quantite { get; set; }

    [Required]
    public int CommandeId { get; set; }

    [ForeignKey("CommandeId")]
    public Commande Commande { get; set; }
}

}
