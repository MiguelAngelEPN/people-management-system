using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserServiceAPI.Data;
using UserServiceAPI.InterfaceService;
using UserServiceAPI.Models;
using UserServiceAPI.Service;

var builder = WebApplication.CreateBuilder(args);

//-------------------------conexion a base de datos
builder.Services.AddDbContext<AppDbContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("CadenaSQL"));
});
//-------------------------------------------------

//-------------------------Configurar Identity para usar PasswordHasher
builder.Services.AddScoped<IPasswordHasher<UserModel>, PasswordHasher<UserModel>>();
builder.Services.AddScoped<IPasswordHasher<AuthenticationService>, PasswordHasher<AuthenticationService>>();
//-------------------------------------------------

//-------------------------Configurar JWT
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

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});
//-------------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//----------------------------- importar servicios
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
//------------------------------------------------

//----------------------------- configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
//------------------------------------------------

var app = builder.Build();

//------------------------------------------------
//  QUITAMOS la condición "solo Development"
// PARA QUE SWAGGER FUNCIONE TAMBIÉN EN DOCKER
//------------------------------------------------
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
    c.RoutePrefix = "swagger"; // Siempre disponible en /swagger
});

app.UseCors("AllowAll");

// Evitar problema de https en Docker
//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
