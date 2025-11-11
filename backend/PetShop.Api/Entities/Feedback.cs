using System;

namespace PetShop.Api.Entities;

public class Feedback
{
    public Guid FeedbackId { get; set; }
    public Guid UserId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? Response { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public ApplicationUser? User { get; set; }
}
