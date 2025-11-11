using System;

namespace PetShop.Api.DTOs.Pets;

public class PetResponse
{
    public Guid PetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Species { get; set; } = string.Empty;
}
