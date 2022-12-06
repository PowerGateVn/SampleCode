using AgedCare.API.Helpers;
using AgedCare.API.Middlewares;
using AgedCare.API.Services;
using AgedCare.Application;
using AgedCare.Application.Common.Interfaces;
using AgedCare.Application.Mappers;
using AgedCare.Application.Validations;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Domain.Settings;
using AgedCare.Infrastructure;
using AgedCare.Infrastructure.Contexts;
using AgedCare.Infrastructure.Persistence;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Reflection;
using System.Text;

namespace AgedCare.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            try
            {
                services.AddApplicationLayer();
                services.AddPersistenceInfrastructure(Configuration);

                //Configuration from AppSettings
                services.Configure<JWTSettings>(Configuration.GetSection("JWT"));
                services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));

                //Adding DB Context with MSSQL
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

                //User Manager Service
                services.AddAutoMapper(typeof(Startup));
                services.AddIdentity<ApplicationUser, ApplicationRole>()
                    .AddRoleManager<RoleManager<ApplicationRole>>()
                    .AddDefaultTokenProviders()
                    .AddEntityFrameworkStores<ApplicationDbContext>();

                services.AddScoped<IAccountService, AccountService>();
                services.AddSingleton<ICurrentUserService, CurrentUserService>();
                services.AddScoped<IEmailService, EmailService>();
                services.AddSingleton<IUriService>(provider =>
                {
                    var accessor = provider.GetRequiredService<IHttpContextAccessor>();
                    var request = accessor.HttpContext.Request;
                    var absoluteUri = string.Concat(request.Scheme, "://", request.Host.ToUriComponent(), "/");
                    return new UriService(absoluteUri);
                });

                //Add CORS
                services.AddCors();

                //Swagger
                services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AgedCare API", Version = "v1" });

                    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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
                        new string[] {}
                    }
                });

                    //Set the comments path for the Swagger JSON and UI.
                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    c.IncludeXmlComments(xmlPath);
                });

                //Adding Authentication - JWT
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                    .AddJwtBearer(o =>
                    {
                        o.RequireHttpsMetadata = false;
                        o.SaveToken = false;
                        o.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.Zero,
                            ValidIssuer = Configuration["JWT:Issuer"],
                            ValidAudience = Configuration["JWT:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Key"]))
                        };
                    });

                //Adding Authorization
                services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();
                services.AddAuthorization();

                services
                    .AddMvc(options =>
                    {
                        options.EnableEndpointRouting = false;
                        options.Filters.Add<ValidationFilter>();
                    })
                    .AddFluentValidation(opt =>
                    {
                        opt.RegisterValidatorsFromAssembly(Assembly.GetAssembly(typeof(RegisterRequestValidator)));
                    })
                    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

                //To use Fluent Validation with custom response validate
                services.Configure<ApiBehaviorOptions>(options =>
                {
                    options.SuppressModelStateInvalidFilter = true;
                });

                //Add repository
                services.AddScoped(typeof(IHealthHistoryRepository), typeof(HealthHistoryRepository));

                //Add auto mapper
                var mapperConfig = new MapperConfiguration(mc =>
                {
                    mc.AddProfile(new AutoMapperProfile());
                });

                IMapper mapper = mapperConfig.CreateMapper();
            }
            catch (Exception e)
            {
                LogUtil.WriteLog($"Exception in ConfigureServices, Exception = {e.Message}, InnerException = {e.InnerException?.Message}");
            }

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ApplicationDbContext dataContext)
        {
            try
            {
                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }

                app.UseAuthentication();

                app.UseHttpsRedirection();

                app.UseStaticFiles();

                app.UseRouting();

                app.UseCors(x => x
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true)
                    .AllowCredentials());

                app.UseAuthorization();

                app.UseSwagger();

                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AgedCare API V1");
                });

                app.UseMiddleware<ErrorHandlerMiddleware>();
                app.UseMiddleware<JwtMiddleware>();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
            }
            catch (Exception e)
            {
                LogUtil.WriteLog($"Exception in Configure, Exception = {e.Message}, InnerException = {e.InnerException?.Message}");
            }
        }
    }
}