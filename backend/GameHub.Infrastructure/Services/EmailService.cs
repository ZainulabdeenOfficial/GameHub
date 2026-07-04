using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MimeKit;
using GameHub.Domain.Interfaces;

namespace GameHub.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = _configuration.GetValue<int>("Email:SmtpPort");
        var smtpUser = _configuration["Email:SmtpUser"];
        var smtpPass = _configuration["Email:SmtpPass"];
        var fromEmail = _configuration["Email:FromEmail"] ?? "noreply@gamehub.com";

        if (!string.IsNullOrEmpty(smtpHost))
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("GameHub", fromEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;
                message.Body = new TextPart("plain") { Text = body };

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                if (!string.IsNullOrEmpty(smtpUser))
                    await client.AuthenticateAsync(smtpUser!, smtpPass ?? string.Empty);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent to {To}: {Subject}", to, subject);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", to);
            }
        }

        _logger.LogWarning("SMTP not configured. Verification code would have been sent to {To}: {Body}", to, body);
    }

    public async Task SendEmailWithTemplateAsync(string to, string subject, string templateName, object model)
    {
        _logger.LogInformation("Template email {Template} requested for {To}", templateName, to);
        await SendEmailAsync(to, subject, $"Template: {templateName}");
    }
}
