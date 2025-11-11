using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.Api.Data;
using PetShop.Api.DTOs.Services;

namespace PetShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly PetShopDbContext _dbContext;

    public ServicesController(PetShopDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceResponse>>> GetServices()
    {
        var services = await _dbContext.Services
            .AsNoTracking()
            .Select(s => new ServiceResponse
            {
                ServiceId = s.ServiceId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price
            })
            .OrderBy(s => s.Name)
            .ToListAsync();

        return Ok(services);
    }
}
