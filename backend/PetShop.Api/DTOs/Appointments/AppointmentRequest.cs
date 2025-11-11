using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PetShop.Api.DTOs.Appointments;

public class AppointmentRequest
{
    public Guid? PetId { get; set; }

    [Required]
    public Guid VeterinarianId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    public string? Notes { get; set; }
}
