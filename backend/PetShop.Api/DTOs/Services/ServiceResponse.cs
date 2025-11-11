using System;

namespace PetShop.Api.DTOs.Services;

public class ServiceResponse
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
}
