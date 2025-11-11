using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PetShop.Api.Entities;

namespace PetShop.Api.Services;

public class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string token, DateTime expiresAt) GenerateToken(ApplicationUser user, string role)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var lifetimeMinutes = jwtSettings.GetValue("AccessTokenLifetime", 60);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SigningKey"]!));

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.FullName ?? $"{user.FirstName} {user.LastName}".Trim()),
            new(ClaimTypes.Role, role)
        };

        if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
        {
            claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));
        }

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(lifetimeMinutes);

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: expires,
            signingCredentials: creds);

        var encoded = new JwtSecurityTokenHandler().WriteToken(token);
        return (encoded, expires);
    }
}
