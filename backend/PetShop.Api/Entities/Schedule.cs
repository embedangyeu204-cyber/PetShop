using System;
using PetShop.Api.Enums;

namespace PetShop.Api.Entities;

public class Schedule
{
    public Guid UserId { get; set; }
    public Guid AppointmentId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public string? Note { get; set; }

    public ApplicationUser? Veterinarian { get; set; }
    public Appointment? Appointment { get; set; }
}
