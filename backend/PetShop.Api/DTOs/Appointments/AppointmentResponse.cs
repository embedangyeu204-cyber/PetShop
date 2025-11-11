using System;
using System.Collections.Generic;

namespace PetShop.Api.DTOs.Appointments;

public class AppointmentResponse
{
    public Guid AppointmentId { get; set; }
    public string? Subject { get; set; }
    public string? Content { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Notes { get; set; }
    public string? VeterinarianName { get; set; }
    public Guid? VeterinarianId { get; set; }
    public Guid? PetId { get; set; }
    public string? PetName { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public decimal ServicePrice { get; set; }
}
