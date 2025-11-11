using System;
using System.Collections.Generic;

namespace PetShop.Api.Entities;

public class Prescription
{
    public Guid PrescriptionId { get; set; }
    public string Medication { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public Guid CreatedBy { get; set; }

    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
}
