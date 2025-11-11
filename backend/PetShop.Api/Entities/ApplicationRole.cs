using System;
using Microsoft.AspNetCore.Identity;

namespace PetShop.Api.Entities;

public class ApplicationRole : IdentityRole<Guid>
{
    public ApplicationRole()
    {
    }

    public ApplicationRole(string roleName) : base(roleName)
    {
        NormalizedName = roleName.ToUpperInvariant();
    }
}
