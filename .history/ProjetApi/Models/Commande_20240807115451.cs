public class Commande
{
    public int Id { get; set; }
    public List<Article> Articles { get; set; }
    public int UserId { get; set; }
    public decimal PrixTotal { get; set; }
}

public class Article
{
    public int Id { get; set; }
    public int ProduitId { get; set; }
    public int QuantiteeCommandee { get; set; }
    public int CommandeId { get; set; }
}
