using System;

namespace PetShop.Api.DTOs.Auth;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDto User { get; set; } = new();
}
