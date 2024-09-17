using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetApi.Models
{
[Table("commande")]
public class Commande
{
    [Key]
    public int CommandeId { get; set; }
    public int UserId { get; set; }
    public decimal PrixTotal { get; set; }
    public ICollection<Article> Articles { get; set; }
}



}
