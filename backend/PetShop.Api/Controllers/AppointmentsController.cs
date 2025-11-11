using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.Api.Data;
using PetShop.Api.DTOs.Appointments;
using PetShop.Api.Entities;
using PetShop.Api.Enums;

namespace PetShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private const string VeterinarianRole = "veterinarian";
    private const string LegacyVeterinaryRole = "veterinary";
    private const int DefaultServiceDurationMinutes = 30;
    private static readonly string[] VeterinarianRoleAliases = { VeterinarianRole, LegacyVeterinaryRole };
    private static readonly TimeSpan[] DefaultSlotTimes =
    {
        new(9, 0, 0),
        new(9, 30, 0),
        new(10, 0, 0),
        new(10, 30, 0),
        new(11, 0, 0),
        new(13, 30, 0),
        new(14, 0, 0),
        new(14, 30, 0),
        new(15, 0, 0)
    };

    private readonly PetShopDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public AppointmentsController(PetShopDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("metadata")]
    public async Task<ActionResult<BookingMetadataResponse>> GetBookingMetadata(
        [FromQuery] int vetPage = 1,
        [FromQuery] int vetPageSize = 5)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        vetPage = vetPage < 1 ? 1 : vetPage;
        vetPageSize = vetPageSize is < 1 or > 50 ? 5 : vetPageSize;

        var pets = await _dbContext.Pets
            .AsNoTracking()
            .Where(p => p.UserId == currentUser.Id)
            .Select(p => new PetSummary
            {
                PetId = p.PetId,
                Name = p.Name,
                Species = p.Species,
                Age = p.Age
            })
            .ToListAsync();

        var services = await _dbContext.Services
            .AsNoTracking()
            .Select(s => new ServiceSummary
            {
                ServiceId = s.ServiceId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = DefaultServiceDurationMinutes
            })
            .OrderBy(s => s.Name)
            .ToListAsync();

        var veterinarians = await GetAllVeterinariansAsync();
        var orderedVets = veterinarians.OrderBy(v => v.FullName ?? v.Email ?? string.Empty).ToList();
        var totalVets = orderedVets.Count;
        var totalVetPages = Math.Max(1, (int)Math.Ceiling(totalVets / (double)vetPageSize));
        var currentVetPage = Math.Min(vetPage, totalVetPages);
        var pagedVets = orderedVets
            .Skip((currentVetPage - 1) * vetPageSize)
            .Take(vetPageSize)
            .Select(v => new VeterinarianSummary
            {
                VeterinarianId = v.Id,
                DisplayName = v.FullName ?? v.Email ?? "Veterinarian",
                Email = v.Email,
                PhoneNumber = v.PhoneNumber
            })
            .ToList();

        return Ok(new BookingMetadataResponse
        {
            Pets = pets,
            Services = services,
            Veterinarians = new PagedResult<VeterinarianSummary>
            {
                Items = pagedVets,
                Pagination = new PaginationInfo
                {
                    Page = currentVetPage,
                    PageSize = vetPageSize,
                    TotalItems = totalVets,
                    TotalPages = totalVetPages
                }
            }
        });
    }

    [HttpGet("available-slots")]
    public async Task<ActionResult<AvailableSlotsResponse>> GetAvailableSlots(
        [FromQuery] Guid veterinarianId,
        [FromQuery] DateTime date,
        [FromQuery] Guid? serviceId = null)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        if (veterinarianId == Guid.Empty)
        {
            return BadRequest(new { message = "veterinarianId is required." });
        }

        var veterinarian = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == veterinarianId);
        if (veterinarian is null || !await UserIsVeterinarianAsync(veterinarian))
        {
            return NotFound(new { message = "Veterinarian not found." });
        }

        var targetDate = date == default ? DateTime.UtcNow.Date : date.Date;
        var dayStart = targetDate;
        var dayEnd = targetDate.AddDays(1);

        var durationMinutes = DefaultServiceDurationMinutes;

        var busySlots = await _dbContext.Schedules
            .AsNoTracking()
            .Where(s =>
                s.UserId == veterinarianId &&
                s.Status != AppointmentStatus.Cancelled &&
                s.StartTime < dayEnd &&
                s.EndTime > dayStart)
            .Select(s => new { s.StartTime, s.EndTime })
            .ToListAsync();

        var available = new List<string>();
        foreach (var offset in DefaultSlotTimes)
        {
            var slotStart = dayStart.Add(offset);
            var slotEnd = slotStart.AddMinutes(durationMinutes);
            var overlaps = busySlots.Any(b => slotStart < b.EndTime && slotEnd > b.StartTime);
            if (!overlaps)
            {
                available.Add(slotStart.ToString("HH:mm"));
            }
        }

        return Ok(new AvailableSlotsResponse
        {
            VeterinarianId = veterinarianId,
            Date = dayStart,
            Slots = available
        });
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<AppointmentResponse>>> GetAppointments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 50 ? 5 : pageSize;

        var roles = await _userManager.GetRolesAsync(currentUser);
        var isVeterinarian = roles.Any(IsVeterinarianRole);
        var isAdmin = roles.Any(r => string.Equals(r, "admin", StringComparison.OrdinalIgnoreCase));

        IQueryable<Appointment> query = _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.Pet)
            .Include(a => a.AppointmentServices)
                .ThenInclude(x => x.Service)
            .Include(a => a.Schedule)
                .ThenInclude(s => s.Veterinarian);

        if (isVeterinarian)
        {
            query = query.Where(a => a.Schedule != null && a.Schedule.UserId == currentUser.Id);
        }
        else if (!isAdmin)
        {
            query = query.Where(a => a.UserId == currentUser.Id);
        }

        var totalCount = await query.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var currentPage = Math.Min(page, totalPages);

        var items = await query
            .OrderByDescending(a => a.Schedule != null ? a.Schedule.StartTime : DateTime.MaxValue)
            .Skip((currentPage - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AppointmentResponse
            {
                AppointmentId = a.AppointmentId,
                Subject = a.Subject,
                Content = a.Content,
                Status = a.Status.ToString(),
                StartTime = a.Schedule != null ? a.Schedule.StartTime : DateTime.MinValue,
                EndTime = a.Schedule != null ? a.Schedule.EndTime : DateTime.MinValue,
                Notes = a.Schedule != null ? a.Schedule.Note : null,
                VeterinarianId = a.Schedule != null ? a.Schedule.UserId : (Guid?)null,
                VeterinarianName = a.Schedule != null && a.Schedule.Veterinarian != null
                    ? a.Schedule.Veterinarian.FullName ?? a.Schedule.Veterinarian.Email
                    : null,
                PetId = a.PetId,
                PetName = a.Pet != null ? a.Pet.Name : null,
                ServiceId = a.AppointmentServices.Select(x => x.ServiceId).FirstOrDefault(),
                ServiceName = a.AppointmentServices.Select(x => x.Service!.Name).FirstOrDefault() ?? string.Empty,
                ServicePrice = a.AppointmentServices.Select(x => x.Service!.Price).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(new PagedResult<AppointmentResponse>
        {
            Items = items,
            Pagination = new PaginationInfo
            {
                Page = currentPage,
                PageSize = pageSize,
                TotalItems = totalCount,
                TotalPages = totalPages
            }
        });
    }

    [Authorize(Roles = "customer")]
    [HttpPost]
    public async Task<ActionResult<AppointmentResponse>> CreateAppointment([FromBody] AppointmentRequest request)
    {
        if (request.EndTime <= request.StartTime)
        {
            return BadRequest(new { message = "EndTime must be after StartTime." });
        }

        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var veterinarian = await _userManager.FindByIdAsync(request.VeterinarianId.ToString());
        if (veterinarian is null || !await UserIsVeterinarianAsync(veterinarian))
        {
            return BadRequest(new { message = "Selected veterinarian is invalid." });
        }

        var service = await _dbContext.Services.FirstOrDefaultAsync(s => s.ServiceId == request.ServiceId);
        if (service is null)
        {
            return BadRequest(new { message = "Selected service not found." });
        }

        Pet? pet = null;
        if (request.PetId.HasValue)
        {
            pet = await _dbContext.Pets.FirstOrDefaultAsync(p => p.PetId == request.PetId && p.UserId == currentUser.Id);
            if (pet is null)
            {
                return BadRequest(new { message = "Pet not found for current user." });
            }
        }

        var overlapping = await _dbContext.Schedules
            .AnyAsync(s =>
                s.UserId == request.VeterinarianId &&
                s.Status != AppointmentStatus.Cancelled &&
                s.StartTime < request.EndTime &&
                s.EndTime > request.StartTime);

        if (overlapping)
        {
            return Conflict(new { message = "Selected time slot is no longer available." });
        }

        var appointment = new Appointment
        {
            AppointmentId = Guid.NewGuid(),
            Subject = service.Name,
            Content = request.Notes,
            Status = AppointmentStatus.Pending,
            UserId = currentUser.Id,
            CreatedBy = currentUser.Id,
            CreatedOn = DateTime.UtcNow,
            PetId = pet?.PetId
        };

        var schedule = new Schedule
        {
            AppointmentId = appointment.AppointmentId,
            UserId = request.VeterinarianId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = AppointmentStatus.Pending,
            Note = request.Notes
        };

        var link = new AppointmentService
        {
            AppointmentId = appointment.AppointmentId,
            ServiceId = service.ServiceId
        };

        appointment.AppointmentServices.Add(link);
        appointment.Schedule = schedule;

        _dbContext.Appointments.Add(appointment);
        _dbContext.Schedules.Add(schedule);
        _dbContext.AppointmentServices.Add(link);

        await _dbContext.SaveChangesAsync();

        var response = new AppointmentResponse
        {
            AppointmentId = appointment.AppointmentId,
            Subject = appointment.Subject,
            Content = appointment.Content,
            Status = appointment.Status.ToString(),
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Notes = schedule.Note,
            VeterinarianId = veterinarian.Id,
            VeterinarianName = veterinarian.FullName ?? veterinarian.Email,
            PetId = pet?.PetId,
            PetName = pet?.Name,
            ServiceId = service.ServiceId,
            ServiceName = service.Name,
            ServicePrice = service.Price
        };

        return Created($"/api/appointments/{appointment.AppointmentId}", response);
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

    private static bool IsVeterinarianRole(string? role) =>
        !string.IsNullOrWhiteSpace(role) &&
        VeterinarianRoleAliases.Any(alias =>
            string.Equals(role, alias, StringComparison.OrdinalIgnoreCase));

    private async Task<bool> UserIsVeterinarianAsync(ApplicationUser user)
    {
        foreach (var roleName in VeterinarianRoleAliases)
        {
            if (await _userManager.IsInRoleAsync(user, roleName))
            {
                return true;
            }
        }

        return false;
    }

    private async Task<IList<ApplicationUser>> GetAllVeterinariansAsync()
    {
        var unique = new Dictionary<Guid, ApplicationUser>();

        foreach (var roleName in VeterinarianRoleAliases)
        {
            var users = await _userManager.GetUsersInRoleAsync(roleName);
            foreach (var user in users)
            {
                unique[user.Id] = user;
            }
        }

        return unique.Values.ToList();
    }
}
