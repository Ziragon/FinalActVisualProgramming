using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApplication1.DbContext;
using WebApplication1.Models;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHttpClient("NoSSL").ConfigurePrimaryHttpMessageHandler(() =>
        new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });
}

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<ProfileService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseRouting();

app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (!db.Database.CanConnect())
        {
            Console.WriteLine("Creating database...");
            db.Database.EnsureCreated();
        }
        else
        {
            Console.WriteLine("Applying migrations...");
            db.Database.Migrate();
        }
        if (!db.Roles.Any())
        {
            Console.WriteLine("Seeding initial roles...");
            db.Roles.AddRange(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Reviewer" },
                new Role { RoleId = 3, RoleName = "User" }
            );
            await db.SaveChangesAsync();
            Console.WriteLine("Initial roles seeded successfully.");
        }
        if (!db.Users.Any(u => u.RoleId == 1))
        {
            Console.WriteLine("Creating admin user...");
            var adminLogin = "Admin";
            var adminPassword = "Password";

            var userService = scope.ServiceProvider.GetRequiredService<UserService>();
            var success = await userService.RegisterAsync(adminLogin, adminPassword, 1);

            if (success)
            {
                Console.WriteLine("Admin user created successfully.");

                var adminUser = await db.Users.FirstAsync(u => u.RoleId == 1);
                var adminProfile = await db.Profiles.FirstAsync(p => p.UserId == adminUser.UserId);

                await db.SaveChangesAsync();
                Console.WriteLine("Admin profile created.");
            }
            else
            {
                Console.WriteLine("Failed to create admin user.");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database error: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
    }
}

app.MapControllers();

app.Run();