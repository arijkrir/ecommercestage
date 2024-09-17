using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail([FromBody] OrderDetails orderDetails)
    {
        try
        {
            var user = GetUserById(orderDetails.UserId);
            var emailBody = GenerateEmailBody(orderDetails, user);

            var smtpClient = new SmtpClient("smtp.your-email-provider.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("your-email@example.com", "your-email-password"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("your-email@example.com"),
                Subject = "Récapitulatif de votre commande",
                Body = emailBody,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(user.Email);

            await smtpClient.SendMailAsync(mailMessage);
            return Ok("Email envoyé avec succès");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erreur lors de l'envoi de l'email: {ex.Message}");
        }
    }

    private string GenerateEmailBody(OrderDetails orderDetails, User user)
    {
        var emailBody = $"<h3>Récapitulatif de votre commande</h3>" +
                        $"<p><strong>Nom:</strong> {user.Nom}</p>" +
                        $"<p><strong>Prénom:</strong> {user.Prenom}</p>" +
                        $"<p><strong>Email:</strong> {user.Email}</p>" +
                        $"<p><strong>Téléphone:</strong> {user.Telephone}</p>" +
                        $"<p><strong>Rue:</strong> {user.Rue}</p>" +
                        $"<p><strong>Ville:</strong> {user.Ville}</p>" +
                        $"<p><strong>Code Postal:</strong> {user.CodePostal}</p>" +
                        $"<p><strong>Type de Livraison:</strong> {orderDetails.TypeLivraison}</p>" +
                        $"<h4>Produits achetés:</h4>";

        foreach (var item in orderDetails.Articles)
        {
            emailBody += $"<p>{item.ProduitId} - Quantité: {item.QuantiteeCommandee}</p>";
        }

        emailBody += $"<h4>Total après promo: {orderDetails.TotalAfterPromo} TND</h4>";
        return emailBody;
    }

    private User GetUserById(int userId)
    {
        // Cette méthode est un exemple pour obtenir les informations utilisateur
        return new User
        {
            Id = userId,
            Nom = "ExempleNom",
            Prenom = "ExemplePrenom",
            Email = "exemple.email@example.com",
            Telephone = "12345678",
            Rue = "Exemple Rue",
            Ville = "Exemple Ville",
            CodePostal = "1234"
        };
    }
}

public class OrderDetails
{
    public int UserId { get; set; }
    public List<Article> Articles { get; set; }
    public string TypeLivraison { get; set; }
    public decimal TotalAfterPromo { get; set; }
}

public class Article
{
    public int ProduitId { get; set; }
    public int QuantiteeCommandee { get; set; }
        public int CommandeId { get; set; }  

}

public class User
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string Email { get; set; }
    public string Telephone { get; set; }
    public string Rue { get; set; }
    public string Ville { get; set; }
    public string CodePostal { get; set; }
}
