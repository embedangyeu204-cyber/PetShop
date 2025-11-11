using System;
using System.Collections.Generic;

namespace PetShop.Api.DTOs.Appointments;

public class AvailableSlotsResponse
{
    public Guid VeterinarianId { get; set; }
    public DateTime Date { get; set; }
    public IEnumerable<string> Slots { get; set; } = Array.Empty<string>();
}
