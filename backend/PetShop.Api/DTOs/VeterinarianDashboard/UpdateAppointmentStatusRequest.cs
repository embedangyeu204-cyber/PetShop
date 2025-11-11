using System.ComponentModel.DataAnnotations;

namespace PetShop.Api.DTOs.VeterinarianDashboard;

public class UpdateAppointmentStatusRequest
{
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }
}
