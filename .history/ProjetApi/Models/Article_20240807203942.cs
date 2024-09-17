namespace ProjetApi.Models
public class Article
{
    public int Id { get; set; }
    public int ProduitId { get; set; }
    public int QuantiteeCommandee { get; set; }
    public int CommandeId { get; set; }
}
