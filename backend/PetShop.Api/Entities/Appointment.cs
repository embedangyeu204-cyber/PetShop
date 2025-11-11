using System;
using System.Collections.Generic;
using PetShop.Api.Enums;

namespace PetShop.Api.Entities;

public class Appointment
{
    public Guid AppointmentId { get; set; }
    public string? Subject { get; set; }
    public string? Content { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public Guid UserId { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public Guid? PetId { get; set; }

    public ApplicationUser? Customer { get; set; }
    public ApplicationUser? Creator { get; set; }
    public Pet? Pet { get; set; }
    public Schedule? Schedule { get; set; }
    public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
}
