using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using PetShop.Api.Data;
using PetShop.Api.Entities;
using PetShop.Api.Services;

const string VeterinarianRole = "veterinarian";
const string LegacyVeterinaryRole = "veterinary";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PetShopDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>(options =>
    {
        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<PetShopDbContext>()
    .AddDefaultTokenProviders();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SigningKey"]!));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = signingKey,
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtTokenService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:7250",
                "http://localhost:5200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PetShop API",
        Version = "v1"
    });

options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    Name = "Authorization",
    Description = "JWT Bearer token. Example: \"Bearer {token}\"",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT"
});

options.AddSecurityRequirement(new OpenApiSecurityRequirement
{
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        Array.Empty<string>()
    }
});
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<PetShopDbContext>();
    await dbContext.Database.MigrateAsync();

    var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    await SeedDataAsync(roleManager, userManager, dbContext);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await app.RunAsync();

static async Task SeedDataAsync(
    RoleManager<ApplicationRole> roleManager,
    UserManager<ApplicationUser> userManager,
    PetShopDbContext dbContext)
{
    await MigrateLegacyVeterinaryRoleAsync(roleManager, userManager);

    var roles = new[] { "customer", VeterinarianRole, "admin" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new ApplicationRole(role));
        }
    }

    await EnsureUserAsync(userManager, "customer@petshop.local", "Customer@123", "customer", "Customer", "Demo");
    await EnsureUserAsync(userManager, "vet@petshop.local", "Vet@12345", VeterinarianRole, "Dr.", "Demo Vet");
    await EnsureUserAsync(userManager, "vet2@petshop.local", "Vet@12345", VeterinarianRole, "Dr.", "Extra Vet");
    await EnsureUserAsync(userManager, "admin@petshop.local", "Admin@123", "admin", "Admin", "Demo");

    var defaultServices = new[]
    {
        ("Wellness Check", "Routine wellness examination for pets", 49m),
        ("Grooming", "Full grooming service including bath and nail trim", 39m),
        ("Vaccination", "Core vaccination package tailored to pet age", 29m)
    };

    foreach (var (name, description, price) in defaultServices)
    {
        var exists = await dbContext.Services.AnyAsync(s => s.Name == name);
        if (!exists)
        {
            dbContext.Services.Add(new Service
            {
                ServiceId = Guid.NewGuid(),
                Name = name,
                Description = description,
                Price = price,
                CreatedOn = DateTime.UtcNow
            });
        }
    }

    await dbContext.SaveChangesAsync();
}

static async Task EnsureUserAsync(
    UserManager<ApplicationUser> userManager,
    string email,
    string password,
    string role,
    string firstName,
    string lastName)
{
    var user = await userManager.FindByEmailAsync(email);
    if (user is not null)
    {
        var roles = await userManager.GetRolesAsync(user);
        if (!roles.Contains(role))
        {
            await userManager.AddToRoleAsync(user, role);
        }
        return;
    }

    user = new ApplicationUser
    {
        Email = email,
        UserName = email,
        FirstName = firstName,
        LastName = lastName,
        FullName = $"{firstName} {lastName}".Trim(),
        PhoneNumber = "0000000000",
        EmailConfirmed = true
    };

    var createResult = await userManager.CreateAsync(user, password);
    if (createResult.Succeeded)
    {
        await userManager.AddToRoleAsync(user, role);
    }
}

static async Task MigrateLegacyVeterinaryRoleAsync(
    RoleManager<ApplicationRole> roleManager,
    UserManager<ApplicationUser> userManager)
{
    var legacyRole = await roleManager.FindByNameAsync(LegacyVeterinaryRole);
    if (legacyRole is null)
    {
        return;
    }

    var veterinarianRole = await roleManager.FindByNameAsync(VeterinarianRole);
    if (veterinarianRole is null)
    {
        legacyRole.Name = VeterinarianRole;
        legacyRole.NormalizedName = VeterinarianRole.ToUpperInvariant();
        await roleManager.UpdateAsync(legacyRole);
        return;
    }

    if (legacyRole.Id == veterinarianRole.Id)
    {
        return;
    }

    var legacyUsers = await userManager.GetUsersInRoleAsync(LegacyVeterinaryRole);
    foreach (var user in legacyUsers)
    {
        if (!await userManager.IsInRoleAsync(user, VeterinarianRole))
        {
            await userManager.AddToRoleAsync(user, VeterinarianRole);
        }
        await userManager.RemoveFromRoleAsync(user, LegacyVeterinaryRole);
    }

    await roleManager.DeleteAsync(legacyRole);
}
