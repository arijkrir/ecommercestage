using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly EmailService _emailService;
    private readonly IUserService _userService; // Service pour obtenir les détails de l'utilisateur

    public OrdersController(EmailService emailService, IUserService userService)
    {
        _emailService = emailService;
        _userService = userService;
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmOrder([FromBody] OrderPayload orderPayload)
    {
        // Logique pour confirmer la commande
        // ...

        // Obtenir les détails de l'utilisateur
        var user = _userService.GetUserById(orderPayload.UserId);
        
        // Générer le corps de l'email
        var emailBody = GenerateEmailBody(orderPayload, user);
        
        // Envoyer l'email de confirmation
        await _emailService.SendEmailAsync(user.Email, "Confirmation de votre commande", emailBody);

        return Ok(new { Message = "Commande confirmée et email envoyé." });
    }

    private string GenerateEmailBody(OrderPayload orderPayload, User user)
    {
        var productsDetails = string.Join("<br/>", orderPayload.Articles.Select(item => 
            $"Produit ID: {item.ProduitId}, Quantité: {item.QuantiteeCommandee}"));

        return $@"
            <h3>Bonjour {user.FirstName} {user.LastName},</h3>
            <p>Merci pour votre commande.</p>
            <p>Voici les détails de votre commande:</p>
            <p><strong>Nom:</strong> {user.FirstName}</p>
            <p><strong>Prénom:</strong> {user.LastName}</p>
            <p><strong>Téléphone:</strong> {user.Phone}</p>
            <p><strong>Type de paiement:</strong> {orderPayload.PaymentType}</p>
            <p><strong>Produits achetés:</strong><br/>{productsDetails}</p>
            <p><strong>Total:</strong> {orderPayload.PrixTotal} TND</p>
            <p>Merci pour votre achat!</p>
            <p>Cordialement,</p>
            <p>Votre équipe de support</p>
        ";
    }
}
