using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.Api.DTOs.Auth;
using PetShop.Api.Entities;
using PetShop.Api.Services;

namespace PetShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private const string VeterinarianRole = "veterinarian";
    private const string LegacyVeterinaryRole = "veterinary";

    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "customer",
        VeterinarianRole
    };

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var requestedRole = CanonicalizeRole(request.Role);
        if (string.IsNullOrEmpty(requestedRole) || !AllowedRoles.Contains(requestedRole))
        {
            return BadRequest(new { message = "Role must be customer or veterinarian." });
        }

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return Conflict(new { message = "Email already registered." });
        }

        var role = await _roleManager.FindByNameAsync(requestedRole);
        if (role is null)
        {
            return BadRequest(new { message = "Role is not available." });
        }

        var user = new ApplicationUser
        {
            Email = request.Email,
            UserName = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            FullName = $"{request.FirstName} {request.LastName}".Trim(),
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            DateOfBirth = request.DateOfBirth,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToArray();
            return BadRequest(new { message = "Unable to register user.", errors });
        }

        await _userManager.AddToRoleAsync(user, requestedRole);

        var tokenResult = _jwtTokenService.GenerateToken(user, requestedRole);

        return Ok(new AuthResponse
        {
            Token = tokenResult.token,
            ExpiresAt = tokenResult.expiresAt,
            User = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,
                Role = requestedRole
            }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var identifier = request.Identifier.Trim();

        ApplicationUser? user = await _userManager.FindByEmailAsync(identifier);
        if (user is null)
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.UserName == identifier || (u.PhoneNumber != null && u.PhoneNumber == identifier));
        }

        if (user is null)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!signInResult.Succeeded)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var role = CanonicalizeRole(roles.FirstOrDefault()) ?? "customer";

        var tokenResult = _jwtTokenService.GenerateToken(user, role);

        return Ok(new AuthResponse
        {
            Token = tokenResult.token,
            ExpiresAt = tokenResult.expiresAt,
            User = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,
                Role = role
            }
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDto>> Profile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var normalizedRole = CanonicalizeRole(roles.FirstOrDefault()) ?? "customer";

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            DateOfBirth = user.DateOfBirth,
            Role = normalizedRole
        });
    }

    private static string? CanonicalizeRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
        {
            return null;
        }

        var normalized = role.Trim().ToLowerInvariant();
        if (normalized == LegacyVeterinaryRole)
        {
            return VeterinarianRole;
        }

        return normalized;
    }
}
