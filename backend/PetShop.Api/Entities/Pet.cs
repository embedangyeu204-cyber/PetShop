using System;
using System.Collections.Generic;

namespace PetShop.Api.Entities;

public class Pet
{
    public Guid PetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Species { get; set; } = string.Empty;
    public Guid UserId { get; set; }

    public ApplicationUser? Owner { get; set; }
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
}
