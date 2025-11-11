using System;
using System.Collections.Generic;

namespace PetShop.Api.Entities;

public class Service
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public Guid? UserId { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public ApplicationUser? Owner { get; set; }
    public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
}
