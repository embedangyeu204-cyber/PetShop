using System;

namespace PetShop.Api.Entities;

public class Notification
{
    public Guid NotificationId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "Unread";
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public Guid UserId { get; set; }

    public ApplicationUser? User { get; set; }
}
