using System;
using System.Collections.Generic;

namespace PetShop.Api.DTOs.Appointments;

public class BookingMetadataResponse
{
    public IEnumerable<ServiceSummary> Services { get; set; } = Array.Empty<ServiceSummary>();
    public IEnumerable<PetSummary> Pets { get; set; } = Array.Empty<PetSummary>();
    public PagedResult<VeterinarianSummary> Veterinarians { get; set; } = new();
}

public class ServiceSummary
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int DurationMinutes { get; set; }
}

public class PetSummary
{
    public Guid PetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public int Age { get; set; }
}

public class VeterinarianSummary
{
    public Guid VeterinarianId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Array.Empty<T>();
    public PaginationInfo Pagination { get; set; } = new();
}

public class PaginationInfo
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
