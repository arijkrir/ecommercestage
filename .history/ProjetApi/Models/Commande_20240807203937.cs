using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetApi.Models
{
public class Commande
{
    public int CommandeId { get; set; }
    public int UserId { get; set; }
    public decimal PrixTotal { get; set; }
    public List<Article> Articles { get; set; } = new List<Article>();
}


}
