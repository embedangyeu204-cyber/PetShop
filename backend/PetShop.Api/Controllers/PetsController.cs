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
using PetShop.Api.DTOs.Pets;
using PetShop.Api.Entities;

namespace PetShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "customer")]
public class PetsController : ControllerBase
{
    private readonly PetShopDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public PetsController(PetShopDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PetResponse>>> GetPets()
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var pets = await _dbContext.Pets
            .AsNoTracking()
            .Where(p => p.UserId == currentUser.Id)
            .Select(p => new PetResponse
            {
                PetId = p.PetId,
                Name = p.Name,
                Age = p.Age,
                Species = p.Species
            })
            .ToListAsync();

        return Ok(pets);
    }

    [HttpPost]
    public async Task<ActionResult<PetResponse>> CreatePet([FromBody] PetRequest request)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var pet = new Pet
        {
            PetId = Guid.NewGuid(),
            Name = request.Name,
            Age = request.Age,
            Species = request.Species,
            UserId = currentUser.Id
        };

        _dbContext.Pets.Add(pet);
        await _dbContext.SaveChangesAsync();

        var response = new PetResponse
        {
            PetId = pet.PetId,
            Name = pet.Name,
            Age = pet.Age,
            Species = pet.Species
        };

        return Created($"/api/pets/{pet.PetId}", response);
    }

    [HttpPut("{petId:guid}")]
    public async Task<ActionResult<PetResponse>> UpdatePet([FromRoute] Guid petId, [FromBody] PetRequest request)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var pet = await _dbContext.Pets.FirstOrDefaultAsync(p => p.PetId == petId && p.UserId == currentUser.Id);
        if (pet is null)
        {
            return NotFound();
        }

        pet.Name = request.Name;
        pet.Age = request.Age;
        pet.Species = request.Species;

        await _dbContext.SaveChangesAsync();

        var response = new PetResponse
        {
            PetId = pet.PetId,
            Name = pet.Name,
            Age = pet.Age,
            Species = pet.Species
        };

        return Ok(response);
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return null;
        }

        return await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
    }
}
