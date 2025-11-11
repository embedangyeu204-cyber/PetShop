using System;
using System.Collections.Generic;
using PetShop.Api.DTOs.Appointments;

namespace PetShop.Api.DTOs.VeterinarianDashboard;

public class VeterinarianDashboardResponse
{
    public List<VeterinarianAppointmentRequestDto> AppointmentRequests { get; set; } = new();
    public List<VeterinarianScheduleItemDto> TodaySchedule { get; set; } = new();
    public List<VeterinarianStatusRowDto> StatusRows { get; set; } = new();
    public PaginationInfo StatusPagination { get; set; } = new();
    public List<VeterinarianWorkingDayDto> WorkingHours { get; set; } = new();
    public List<VeterinarianServiceOptionDto> Services { get; set; } = new();
    public VeterinarianDashboardSummaryDto Summary { get; set; } = new();
}

public class VeterinarianAppointmentRequestDto
{
    public Guid AppointmentId { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime PreferredStartTime { get; set; }
    public DateTime PreferredEndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string? OwnerAvatarUrl { get; set; }
}

public class VeterinarianScheduleItemDto
{
    public Guid AppointmentId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class VeterinarianStatusRowDto
{
    public Guid AppointmentId { get; set; }
    public DateTime StartTime { get; set; }
    public Guid? ServiceId { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? OwnerAvatarUrl { get; set; }
}

public class VeterinarianWorkingDayDto
{
    public string Day { get; set; } = string.Empty;
    public bool Active { get; set; }
    public List<string> Slots { get; set; } = new();
}

public class VeterinarianDashboardSummaryDto
{
    public int PendingRequests { get; set; }
    public int ProcessedToday { get; set; }
    public int UpcomingAppointments { get; set; }
    public string ActiveFilters { get; set; } = "Open";
}

public class VeterinarianServiceOptionDto
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
}
