using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetShop.Api.Entities;

namespace PetShop.Api.Data;

public class PetShopDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public PetShopDbContext(DbContextOptions<PetShopDbContext> options) : base(options)
    {
    }

    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<AppointmentService> AppointmentServices => Set<AppointmentService>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
            entity.Property(u => u.FirstName).HasMaxLength(100);
            entity.Property(u => u.LastName).HasMaxLength(100);
            entity.Property(u => u.FullName).HasMaxLength(200);
        });

        builder.Entity<ApplicationRole>(entity =>
        {
            entity.ToTable("Roles");
        });

        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

        builder.Entity<Pet>(entity =>
        {
            entity.ToTable("Pet");
            entity.HasKey(p => p.PetId);
            entity.Property(p => p.Name).HasMaxLength(150).IsRequired();
            entity.Property(p => p.Species).HasMaxLength(100).IsRequired();

            entity.HasOne(p => p.Owner)
                  .WithMany(u => u.Pets)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Service>(entity =>
        {
            entity.ToTable("Services");
            entity.HasKey(s => s.ServiceId);
            entity.Property(s => s.Name).HasMaxLength(200).IsRequired();
            entity.Property(s => s.Price).HasColumnType("decimal(10,2)");
        });

        builder.Entity<Appointment>(entity =>
        {
            entity.ToTable("Appointments");
            entity.HasKey(a => a.AppointmentId);
            entity.Property(a => a.Subject).HasMaxLength(250);
            entity.Property(a => a.Status).HasConversion<string>().HasMaxLength(50);

            entity.HasOne(a => a.Customer)
                  .WithMany(u => u.CustomerAppointments)
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Creator)
                  .WithMany()
                  .HasForeignKey(a => a.CreatedBy)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Pet)
                  .WithMany()
                  .HasForeignKey(a => a.PetId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Schedule>(entity =>
        {
            entity.ToTable("Schedule");
            entity.HasKey(s => new { s.UserId, s.AppointmentId });
            entity.Property(s => s.Status).HasConversion<string>().HasMaxLength(50);

            entity.HasOne(s => s.Veterinarian)
                  .WithMany(u => u.VeterinarianSchedules)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(s => s.Appointment)
                  .WithOne(a => a.Schedule)
                  .HasForeignKey<Schedule>(s => s.AppointmentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<AppointmentService>(entity =>
        {
            entity.ToTable("AppointmentService");
            entity.HasKey(x => new { x.AppointmentId, x.ServiceId });

            entity.HasOne(x => x.Appointment)
                  .WithMany(a => a.AppointmentServices)
                  .HasForeignKey(x => x.AppointmentId);

            entity.HasOne(x => x.Service)
                  .WithMany(s => s.AppointmentServices)
                  .HasForeignKey(x => x.ServiceId);
        });

        builder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notification");
            entity.HasKey(n => n.NotificationId);
        });

        builder.Entity<Feedback>(entity =>
        {
            entity.ToTable("Feedback");
            entity.HasKey(f => f.FeedbackId);
        });

        builder.Entity<MedicalRecord>(entity =>
        {
            entity.ToTable("MedicalRecord");
            entity.HasKey(m => m.MedicalRecordId);

            entity.HasOne(m => m.User)
                  .WithMany(u => u.MedicalRecords)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Pet)
                  .WithMany(p => p.MedicalRecords)
                  .HasForeignKey(m => m.PetId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.Prescription)
                  .WithMany(p => p.MedicalRecords)
                  .HasForeignKey(m => m.PrescriptionId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Prescription>(entity =>
        {
            entity.ToTable("Prescription");
            entity.HasKey(p => p.PrescriptionId);
        });
    }
}
