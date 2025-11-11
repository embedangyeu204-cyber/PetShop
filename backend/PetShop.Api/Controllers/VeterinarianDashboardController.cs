using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.Api.Data;
using PetShop.Api.DTOs.Appointments;
using PetShop.Api.DTOs.VeterinarianDashboard;
using PetShop.Api.Entities;
using PetShop.Api.Enums;

namespace PetShop.Api.Controllers;

[ApiController]
[Route("api/veterinarian-dashboard")]
[Authorize]
public class VeterinarianDashboardController : ControllerBase
{
    private static readonly string[] VeterinarianRoleAliases = { "veterinarian", "veterinary" };

    private readonly PetShopDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public VeterinarianDashboardController(
        PetShopDbContext dbContext,
        UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpPatch("{appointmentId:guid}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(
        Guid appointmentId,
        [FromBody] UpdateAppointmentStatusRequest request)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        if (!await UserIsVeterinarianAsync(currentUser))
        {
            return Forbid();
        }

        if (!Enum.TryParse<AppointmentStatus>(request.Status, true, out var newStatus))
        {
            return BadRequest(new { message = "Invalid status value." });
        }

        var schedule = await _dbContext.Schedules
            .Include(s => s.Appointment)
            .FirstOrDefaultAsync(s => s.UserId == currentUser.Id && s.AppointmentId == appointmentId);

        if (schedule is null || schedule.Appointment is null)
        {
            return NotFound(new { message = "Appointment was not found for this veterinarian." });
        }

        if (schedule.Status == newStatus)
        {
            return NoContent();
        }

        schedule.Status = newStatus;
        schedule.Note = request.Notes ?? schedule.Note;
        schedule.Appointment.Status = newStatus;
        schedule.Appointment.Content = request.Notes ?? schedule.Appointment.Content;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<VeterinarianDashboardResponse>> GetDashboard(
        [FromQuery] DateTime? date = null,
        [FromQuery] string? status = null,
        [FromQuery] Guid? serviceId = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        if (!await UserIsVeterinarianAsync(currentUser))
        {
            return Forbid();
        }

        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 50 ? 10 : pageSize;

        var today = (date ?? DateTime.UtcNow).Date;
        var tomorrow = today.AddDays(1);
        var now = DateTime.UtcNow;

        AppointmentStatus? statusFilter = null;
        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<AppointmentStatus>(status, true, out var parsedStatus))
        {
            statusFilter = parsedStatus;
        }

        var searchTerm = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
        var searchLower = searchTerm?.ToLowerInvariant();

        var requestCutoff = now.AddHours(-24);

        var appointmentRequestsProjection = await CreateScheduleProjection(currentUser.Id)
            .Where(s => s.Status == AppointmentStatus.Pending && s.CreatedOn >= requestCutoff)
            .OrderBy(s => s.CreatedOn)
            .Take(5)
            .ToListAsync();

        var appointmentRequests = appointmentRequestsProjection
            .Select(snapshot =>
            {
                var ownerName = BuildOwnerName(snapshot.OwnerFullName, snapshot.OwnerFirstName, snapshot.OwnerLastName, snapshot.OwnerEmail);
                return new VeterinarianAppointmentRequestDto
                {
                    AppointmentId = snapshot.AppointmentId,
                    RequestedAt = ToVetLocal(snapshot.CreatedOn),
                    PreferredStartTime = ToVetLocal(snapshot.StartTime),
                    PreferredEndTime = ToVetLocal(snapshot.EndTime),
                    Status = MapStatus(snapshot.Status),
                    PetName = snapshot.PetName ?? "Unassigned",
                    PetSpecies = snapshot.PetSpecies ?? string.Empty,
                    OwnerName = ownerName,
                    ServiceName = snapshot.ServiceName ?? "Clinic service",
                    OwnerAvatarUrl = BuildAvatarUrl(ownerName)
                };
            })
            .ToList();

        var statusQuery = CreateScheduleProjection(currentUser.Id)
            .Where(s => s.StartTime >= today);

        if (statusFilter.HasValue)
        {
            statusQuery = statusQuery.Where(s => s.Status == statusFilter.Value);
        }

        if (serviceId.HasValue)
        {
            statusQuery = statusQuery.Where(s => s.ServiceId == serviceId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchLower))
        {
            statusQuery = statusQuery.Where(s =>
                (s.PetName != null && s.PetName.ToLower().Contains(searchLower)) ||
                (s.PetSpecies != null && s.PetSpecies.ToLower().Contains(searchLower)) ||
                (s.OwnerFullName != null && s.OwnerFullName.ToLower().Contains(searchLower)) ||
                (s.OwnerFirstName != null && s.OwnerFirstName.ToLower().Contains(searchLower)) ||
                (s.OwnerLastName != null && s.OwnerLastName.ToLower().Contains(searchLower)) ||
                (s.OwnerEmail != null && s.OwnerEmail.ToLower().Contains(searchLower)) ||
                (s.ServiceName != null && s.ServiceName.ToLower().Contains(searchLower)));
        }

        var totalItems = await statusQuery.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(totalItems / (double)pageSize));
        var currentPage = Math.Min(page, totalPages);

        var pagedStatusSnapshots = await statusQuery
            .OrderBy(s => s.StartTime)
            .Skip((currentPage - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var todaysSnapshots = await statusQuery
            .Where(s => s.StartTime < tomorrow && s.Status != AppointmentStatus.Cancelled)
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        if (appointmentRequests.Count == 0)
        {
            appointmentRequests = todaysSnapshots
                .Where(snapshot => snapshot.Status != AppointmentStatus.Cancelled)
                .Select(snapshot =>
                {
                    var ownerName = BuildOwnerName(snapshot.OwnerFullName, snapshot.OwnerFirstName, snapshot.OwnerLastName, snapshot.OwnerEmail);
                    return new VeterinarianAppointmentRequestDto
                    {
                        AppointmentId = snapshot.AppointmentId,
                        RequestedAt = ToVetLocal(snapshot.CreatedOn),
                        PreferredStartTime = ToVetLocal(snapshot.StartTime),
                        PreferredEndTime = ToVetLocal(snapshot.EndTime),
                        Status = MapStatus(snapshot.Status),
                        PetName = snapshot.PetName ?? "Unassigned",
                        PetSpecies = snapshot.PetSpecies ?? string.Empty,
                        OwnerName = ownerName,
                        ServiceName = snapshot.ServiceName ?? "Clinic service",
                        OwnerAvatarUrl = BuildAvatarUrl(ownerName)
                    };
                })
                .ToList();
        }

        var todaysSchedule = todaysSnapshots
            .Select(snapshot => new VeterinarianScheduleItemDto
            {
                AppointmentId = snapshot.AppointmentId,
                StartTime = ToVetLocal(snapshot.StartTime),
                EndTime = ToVetLocal(snapshot.EndTime),
                PetName = snapshot.PetName ?? "Unassigned",
                PetSpecies = snapshot.PetSpecies ?? string.Empty,
                ServiceName = snapshot.ServiceName ?? "Clinic service",
                Status = MapStatus(snapshot.Status)
            })
            .ToList();

        var statusRows = pagedStatusSnapshots
            .Select(snapshot =>
            {
                var ownerName = BuildOwnerName(snapshot.OwnerFullName, snapshot.OwnerFirstName, snapshot.OwnerLastName, snapshot.OwnerEmail);
                return new VeterinarianStatusRowDto
                {
                    AppointmentId = snapshot.AppointmentId,
                    StartTime = ToVetLocal(snapshot.StartTime),
                    ServiceId = snapshot.ServiceId,
                    PetName = snapshot.PetName ?? "Unassigned",
                    PetSpecies = snapshot.PetSpecies ?? string.Empty,
                    OwnerName = ownerName,
                    ServiceName = snapshot.ServiceName ?? "Clinic service",
                    Status = MapStatus(snapshot.Status),
                    OwnerAvatarUrl = BuildAvatarUrl(ownerName)
                };
            })
            .ToList();

        var pendingCount = await _dbContext.Schedules
            .AsNoTracking()
            .Where(s => s.UserId == currentUser.Id && s.Status == AppointmentStatus.Pending)
            .CountAsync();

        var processedTodayCount = await _dbContext.Schedules
            .AsNoTracking()
            .Where(s =>
                s.UserId == currentUser.Id &&
                s.Status == AppointmentStatus.Completed &&
                s.StartTime >= today &&
                s.StartTime < tomorrow)
            .CountAsync();

        var upcomingCount = await _dbContext.Schedules
            .AsNoTracking()
            .Where(s =>
                s.UserId == currentUser.Id &&
                s.Status != AppointmentStatus.Cancelled &&
                s.StartTime >= today)
            .CountAsync();

        var summary = new VeterinarianDashboardSummaryDto
        {
            PendingRequests = pendingCount,
            ProcessedToday = processedTodayCount,
            UpcomingAppointments = upcomingCount,
            ActiveFilters = BuildActiveFilters(statusFilter, serviceId, searchTerm)
        };

        var weekStart = GetWeekStart(today);
        var weekEnd = weekStart.AddDays(7);

        var weekSlots = await _dbContext.Schedules
            .AsNoTracking()
            .Where(s =>
                s.UserId == currentUser.Id &&
                s.StartTime >= weekStart &&
                s.StartTime < weekEnd &&
                s.Status != AppointmentStatus.Cancelled)
            .Select(s => new WorkingSlot
            {
                StartTime = ToVetLocal(s.StartTime),
                EndTime = ToVetLocal(s.EndTime)
            })
            .ToListAsync();

        var workingHours = BuildWorkingHours(weekStart, weekSlots);

        var serviceOptions = await _dbContext.Services
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new VeterinarianServiceOptionDto
            {
                ServiceId = s.ServiceId,
                Name = s.Name
            })
            .ToListAsync();

        var response = new VeterinarianDashboardResponse
        {
            AppointmentRequests = appointmentRequests,
            TodaySchedule = todaysSchedule,
            StatusRows = statusRows,
            StatusPagination = new PaginationInfo
            {
                Page = currentPage,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            },
            WorkingHours = workingHours,
            Services = serviceOptions,
            Summary = summary
        };

        return Ok(response);
    }

    private static readonly TimeSpan VetTimeOffset = TimeSpan.FromHours(7);

    private static DateTime ToVetLocal(DateTime value)
    {
        var utc = value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };

        var local = utc.Add(VetTimeOffset);
        return DateTime.SpecifyKind(local, DateTimeKind.Unspecified);
    }

    private IQueryable<ScheduleSnapshot> CreateScheduleProjection(Guid veterinarianId)
    {
        return _dbContext.Schedules
            .AsNoTracking()
            .Where(s => s.UserId == veterinarianId)
            .Select(s => new ScheduleSnapshot
            {
                AppointmentId = s.AppointmentId,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Status = s.Status,
                PetName = s.Appointment!.Pet != null ? s.Appointment.Pet.Name : null,
                PetSpecies = s.Appointment.Pet != null ? s.Appointment.Pet.Species : null,
                OwnerFullName = s.Appointment.Customer != null ? s.Appointment.Customer.FullName : null,
                OwnerFirstName = s.Appointment.Customer != null ? s.Appointment.Customer.FirstName : null,
                OwnerLastName = s.Appointment.Customer != null ? s.Appointment.Customer.LastName : null,
                OwnerEmail = s.Appointment.Customer != null ? s.Appointment.Customer.Email : null,
                ServiceId = s.Appointment.AppointmentServices
                    .Select(link => (Guid?)link.ServiceId)
                    .FirstOrDefault(),
                ServiceName = s.Appointment.AppointmentServices
                    .Select(link => link.Service != null ? link.Service.Name : null)
                    .FirstOrDefault(),
                CreatedOn = s.Appointment.CreatedOn
            });
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is not null)
        {
            return user;
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userId, out var parsedId))
        {
            return await _userManager.Users.FirstOrDefaultAsync(u => u.Id == parsedId);
        }

        return null;
    }

    private async Task<bool> UserIsVeterinarianAsync(ApplicationUser user)
    {
        foreach (var role in VeterinarianRoleAliases)
        {
            if (await _userManager.IsInRoleAsync(user, role))
            {
                return true;
            }
        }

        return false;
    }

    private static string BuildOwnerName(string? fullName, string? firstName, string? lastName, string? fallbackEmail)
    {
        if (!string.IsNullOrWhiteSpace(fullName))
        {
            return fullName;
        }

        var composed = $"{firstName ?? string.Empty} {lastName ?? string.Empty}".Trim();
        if (!string.IsNullOrWhiteSpace(composed))
        {
            return composed;
        }

        if (!string.IsNullOrWhiteSpace(fallbackEmail))
        {
            return fallbackEmail!;
        }

        return "Pet parent";
    }

    private static string BuildAvatarUrl(string name)
    {
        var safeName = Uri.EscapeDataString(string.IsNullOrWhiteSpace(name) ? "Pet parent" : name);
        return $"https://ui-avatars.com/api/?background=6366F1&color=fff&name={safeName}";
    }

    private static string BuildActiveFilters(AppointmentStatus? statusFilter, Guid? serviceId, string? searchTerm)
    {
        var filters = new List<string>();
        if (statusFilter.HasValue)
        {
            filters.Add(statusFilter.Value.ToString());
        }

        if (serviceId.HasValue)
        {
            filters.Add("Service");
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            filters.Add("Search");
        }

        return filters.Count > 0 ? string.Join(", ", filters) : "Open";
    }

    private static string MapStatus(AppointmentStatus status) =>
        status switch
        {
            AppointmentStatus.Completed => "Checked-In",
            AppointmentStatus.Confirmed => "Scheduled",
            AppointmentStatus.Pending => "Pending",
            AppointmentStatus.Cancelled => "Cancelled",
            _ => status.ToString()
        };

    private static DateTime GetWeekStart(DateTime date)
    {
        var diff = (7 + (int)date.DayOfWeek - (int)DayOfWeek.Monday) % 7;
        return date.AddDays(-diff).Date;
    }

    private static List<VeterinarianWorkingDayDto> BuildWorkingHours(DateTime weekStart, IEnumerable<WorkingSlot> slots)
    {
        var workingHours = new List<VeterinarianWorkingDayDto>(7);
        var slotLookup = slots
            .GroupBy(slot => slot.StartTime.Date)
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.StartTime).ToList());

        for (var i = 0; i < 7; i++)
        {
            var dayDate = weekStart.AddDays(i);
            var hasSlots = slotLookup.TryGetValue(dayDate.Date, out var daySlots);
            var formattedSlots = hasSlots
                ? daySlots!
                    .Select(slot => $"{slot.StartTime:HH\\:mm}-{slot.EndTime:HH\\:mm}")
                    .Distinct()
                    .ToList()
                : new List<string>();

            workingHours.Add(new VeterinarianWorkingDayDto
            {
                Day = dayDate.ToString("ddd", CultureInfo.InvariantCulture),
                Active = formattedSlots.Count > 0,
                Slots = formattedSlots
            });
        }

        return workingHours;
    }

    private sealed class ScheduleSnapshot
    {
        public Guid AppointmentId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public Guid? ServiceId { get; set; }
        public string? PetName { get; set; }
        public string? PetSpecies { get; set; }
        public string? OwnerFullName { get; set; }
        public string? OwnerFirstName { get; set; }
        public string? OwnerLastName { get; set; }
        public string? OwnerEmail { get; set; }
        public string? ServiceName { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    private sealed class WorkingSlot
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
