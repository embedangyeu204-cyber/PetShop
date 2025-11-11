using System;
using System.ComponentModel.DataAnnotations;

namespace PetShop.Api.DTOs.Pets;

public class PetRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Age { get; set; }

    [Required]
    public string Species { get; set; } = string.Empty;
}
