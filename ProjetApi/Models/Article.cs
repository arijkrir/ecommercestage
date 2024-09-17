using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ProjetApi.Models
{
    [Table("article")]
    public class Article
{
    public int Id { get; set; }
    public int ProduitId { get; set; }
    public int QuantiteeCommandee { get; set; }
    public int CommandeId { get; set; }
}
}

