using NLog.Web;
using NLog;
using Handy;
using Handy.Entities;
using Handy.Services;
using Handy.Middleware;
using Handy.Authentication;
using FluentValidation;
using Handy.Models;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Handy.Data;
using Handy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Handy.Api.Data.Validators;
using HandyApi.Services;
using NSwag;
using NSwag.Generation.Processors.Security;
using Handy.Api.Services;
using Handy.Api.Hubs;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

internal class Program
{
    private static void Main(string[] args)
    {   
       
        var builder = WebApplication.CreateBuilder(args);
        var authenticationSettings = new AuthenticationSettings();
        var jwtKey = builder.Configuration.GetSection("Authentication:JwtKey").Get<string>();

        builder.Configuration.GetSection("Authentication").Bind(authenticationSettings);

        /* builder.Services.AddAuthentication(option =>
         {
             option.DefaultAuthenticateScheme = "Bearer";
             option.DefaultScheme = "Bearer";
             option.DefaultChallengeScheme = "Bearer";
         }).AddJwtBearer(cfg =>
         {
             cfg.Events = new JwtBearerEvents()
             {

                 OnTokenValidated = ctx =>
                 {
                     Console.WriteLine();
                     Console.WriteLine("Claims from the access token");
                     if (ctx?.Principal != null)
                     {
                         foreach (var claim in ctx.Principal.Claims)
                         {
                             Console.WriteLine($"{claim.Type} - {claim.Value}");
                         }
                     }
                     Console.WriteLine();
                     return Task.CompletedTask;
                 }
             };

             cfg.RequireHttpsMetadata = false;
             cfg.SaveToken = true;
             cfg.TokenValidationParameters = new TokenValidationParameters
             {
                 ValidateIssuer = true,
                 ValidateAudience = true,
                 ValidateLifetime = true,
                 ValidateIssuerSigningKey = true,
                 ValidIssuer = authenticationSettings.JwtIssuer,
                 ValidAudience = authenticationSettings.JwtIssuer,
                 IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                 RoleClaimType = ClaimTypes.Role
             };

         });*/

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"));
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false
        };

        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });


        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
                   .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information); 
        });
        builder.Logging.ClearProviders();
        builder.Host.UseNLog();
       

        builder.Services.AddScoped<AccountSeeder>();
        builder.Services.AddControllers();
        builder.Services.AddAutoMapper(typeof(Program));

        builder.Services.AddSingleton(authenticationSettings);

        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IRoleService, RoleService>();
        builder.Services.AddScoped<IHandymanService, HandymanService>();
        builder.Services.AddScoped<IOfferService, OfferService>();
        builder.Services.AddScoped<IRatingRespondService, RatingRespondService>();
        builder.Services.AddScoped<IRatingService, RatingService>();
        builder.Services.AddScoped<ISkillService, SkillService>();
        builder.Services.AddScoped<ITaskService, TaskService>();
        builder.Services.AddScoped<IUserClientService, UserClientService>();
        builder.Services.AddScoped<IRegionService, RegionService>();
        builder.Services.AddScoped<IConflictService, ConflictService>();
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddHttpClient();

        builder.Services.AddScoped<IUserContextService, UserContextService>();
        builder.Services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters();
        builder.Services.AddScoped<ErrorHandlingMiddleware>();
        builder.Services.AddScoped<IValidator<CreateUserDto>, CreateUserValidator>();
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddScoped<IPhotoService>(provider =>
        {
            var secret = builder.Configuration["UploadThing:UPLOADTHING_SECRET"];
            var dbContext = provider.GetRequiredService<AppDbContext>(); 
            return new PhotoService(secret, dbContext);
        });


        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        builder.Services.AddOpenApiDocument(configure =>
        {
            configure.Title = "Your API Title";
            configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the textbox: 'Bearer {your JWT token}'."
            });

            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        builder.Services.AddSignalR(opt =>
        {
            opt.EnableDetailedErrors = true;
        });

        var app = builder.Build();


        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseOpenApi(); 
            app.UseReDoc(config => 
            {
                config.Path = "/redoc";
            });
        }


        app.UseCors(builder =>
        {
            builder.WithOrigins("http://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseMiddleware<ErrorHandlingMiddleware>();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<ChatHub>("/chathub/{chatIdentifier}");
        });

        SeedDatabase(app);

        app.Run();
    }

    private static void SeedDatabase(WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var seeder = services.GetRequiredService<AccountSeeder>();
                seeder.Seed();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }
    }
}
