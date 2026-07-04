namespace GameHub.Domain.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendEmailWithTemplateAsync(string to, string subject, string templateName, object model);
}
