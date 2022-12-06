using AgedCare.API.Helpers;
using AgedCare.Domain.Entities.Identity;
using AgedCare.Infrastructure.Contexts;
using AgedCare.Infrastructure.Seeds;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using System;
using System.IO;
using System.Threading.Tasks;

namespace AgedCare.API
{
    public class Program
    {
        public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", false, true)
            .Build();

        public static async Task Main(string[] args)
        {
            try
            {
                var host = CreateHostBuilder(args).Build();
                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;

                    var connectionString = Configuration.GetSection("ConnectionStrings")["DefaultConnection"];
                    var sinkOpts = new MSSqlServerSinkOptions { TableName = "Logs" };

                    Log.Logger = new LoggerConfiguration()
                        .MinimumLevel.Warning()
                        .WriteTo
                        .MSSqlServer(connectionString, sinkOpts)
                        .CreateLogger();

                    try
                    {
                        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
                        var appContext = services.GetRequiredService<ApplicationDbContext>();

                        await appContext.Database.MigrateAsync();

                        await SeedAccount.SeedDefaultData(userManager, roleManager);

                        Log.Information("Application Starting");
                    }
                    catch (Exception ex)
                    {
                        Log.Error(ex, "An error occurred seeding the DB.");
                    }
                }

                await host.RunAsync();
            }
            catch (Exception e)
            {
                LogUtil.WriteLog($"Exception in Main, Exception = {e.Message}, InnerException = {e.InnerException?.Message}");
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    try
                    {
                        webBuilder.UseStartup<Startup>();
                        webBuilder.UseConfiguration(Configuration);
                        webBuilder.UseSerilog();
                    }
                    catch (Exception e)
                    {
                        LogUtil.WriteLog($"Exception in CreateHostBuilder, Exception = {e.Message}, InnerException = {e.InnerException?.Message}");
                    }
                });
    }
}