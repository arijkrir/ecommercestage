using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

public class GmailService
{
    private readonly GmailService _service;

    public GmailService(string token)
    {
        var credential = GoogleCredential.FromAccessToken(token);
        _service = new GmailService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = "Your Application Name",
        });
    }

    public async Task SendEmailAsync(OrderConfirmationDto orderConfirmation)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress("your-email@gmail.com", "Your E-Commerce Site"),
            Subject = "Order Confirmation",
            Body = GenerateEmailBody(orderConfirmation),
            IsBodyHtml = false
        };

        mailMessage.To.Add(new MailAddress(orderConfirmation.UserEmail, orderConfirmation.UserName));

        var sendRequest = new Message
        {
            Raw = Base64UrlEncode(mailMessage.ToString())
        };

        await _service.Users.Messages.Send(sendRequest, "me").ExecuteAsync();
    }

    private string GenerateEmailBody(OrderConfirmationDto dto)
    {
        var body = $"Dear {dto.UserName},\n\n" +
                   "Thank you for your order! Here is the summary of your purchase:\n\n" +
                   $"Total Price: {dto.TotalPrice:C}\n" +
                   $"Delivery Date: {dto.DeliveryDate.ToShortDateString()}\n\n" +
                   "Items:\n";

        foreach (var item in dto.Items)
        {
            body += $"- {item.ProductName}: {item.Quantity}\n";
        }

        body += "\nThank you for shopping with us!\n\nBest regards,\nYour E-Commerce Team";
        return body;
    }

    private string Base64UrlEncode(string input)
    {
        var bytes = System.Text.Encoding.UTF8.GetBytes(input);
        return Convert.ToBase64String(bytes).Replace('+', '-').Replace('/', '_').Replace("=", "");
    }
}
public class OrderConfirmationDto
{
    public string UserName { get; set; }
    public string UserEmail { get; set; }
    public List<OrderItemDto> Items { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime DeliveryDate { get; set; }
}

public class OrderItemDto
{
    public string ProductName { get; set; }
    public int Quantity { get; set; }
}

