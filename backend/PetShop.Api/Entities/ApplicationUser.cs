using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace PetShop.Api.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    public ICollection<Appointment> CustomerAppointments { get; set; } = new List<Appointment>();
    public ICollection<Schedule> VeterinarianSchedules { get; set; } = new List<Schedule>();
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
}
