## PetShop.Api

ASP.NET Core 8 Web API that powers authentication, role-based access, and appointment booking for the PetShop frontend.

### Prerequisites

- .NET SDK 8.0.x (stable channel; `global.json` pins the solution to 8.0.7)
- SQL Server instance. On Windows, `LocalDB` (`(localdb)\MSSQLLocalDB`) is sufficient.

> **Note:** The Codex sandbox ships with a preview .NET 10 SDK that may crash Roslyn during builds. Install a stable .NET 8 SDK locally or develop inside a container based on .NET 8.

### Getting Started

```bash
cd backend/PetShop.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

The default launch profile exposes:

- `https://localhost:7250`
- `http://localhost:5200`

Swagger UI is available at `/swagger`. CORS already allows `http://localhost:3000` to match the React app.

### Seed Data

On startup the API ensures:

- Roles: `customer`, `veterinarian`, `admin`
- Sample veterinarian account: `vet@petshop.local` / `Vet@12345`
- Default services: Wellness Check, Grooming, Vaccination

### Key Endpoints

**Authentication (`/api/auth`)**

| Method | Route        | Description                                       |
| ------ | ------------ | ------------------------------------------------- |
| POST   | `/register`  | Register new customer or veterinarian             |
| POST   | `/login`     | Email/phone login, returns JWT + profile payload  |
| GET    | `/profile`   | Fetch authenticated user profile                  |

**Pets (`/api/pets`, requires role `customer`)**

| Method | Route | Description                  |
| ------ | ----- | ---------------------------- |
| GET    | `/`   | List current user's pets     |
| POST   | `/`   | Create a new pet for user    |

**Services (`/api/services`)**

| Method | Route | Description                        |
| ------ | ----- | ---------------------------------- |
| GET    | `/`   | List available veterinary services |

**Appointments (`/api/appointments`)**

| Method | Route        | Description                                                          |
| ------ | ------------ | -------------------------------------------------------------------- |
| GET    | `/metadata`  | Returns services, pets, and veterinarian options for booking UI      |
| GET    | `/`          | Customers see their bookings; vets see appointments assigned to them |
| POST   | `/`          | Customer books a service with a veterinarian                          |

### Configuration Overrides

`appsettings.json` contains the default SQL Server connection string and JWT settings. Override them as needed via environment variables:

- `ConnectionStrings__DefaultConnection`
- `JwtSettings__Issuer`
- `JwtSettings__Audience`
- `JwtSettings__SigningKey`
- `JwtSettings__AccessTokenLifetime`

### Frontend Integration Notes

- Store the JWT + role + user detail in `localStorage` using the keys already referenced by the React app (`token` / `authToken`, `role` / `userRole`, `user`).
- Fetch services with `GET /api/services`, pets with `GET /api/pets`, and create bookings via `POST /api/appointments`.
- Use the seeded veterinarian account or register new vets to test vet-specific dashboards.
