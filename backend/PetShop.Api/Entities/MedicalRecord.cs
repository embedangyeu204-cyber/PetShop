using System;
using System.Collections.Generic;

namespace PetShop.Api.Entities;

public class MedicalRecord
{
    public Guid MedicalRecordId { get; set; }
    public Guid UserId { get; set; }
    public Guid PetId { get; set; }
    public Guid? PrescriptionId { get; set; }
    public string? Diagnosis { get; set; }
    public string? TreatmentNote { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public ApplicationUser? User { get; set; }
    public Pet? Pet { get; set; }
    public Prescription? Prescription { get; set; }
}
