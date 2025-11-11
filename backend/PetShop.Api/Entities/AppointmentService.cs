using System;

namespace PetShop.Api.Entities;

public class AppointmentService
{
    public Guid AppointmentId { get; set; }
    public Guid ServiceId { get; set; }

    public Appointment? Appointment { get; set; }
    public Service? Service { get; set; }
}
