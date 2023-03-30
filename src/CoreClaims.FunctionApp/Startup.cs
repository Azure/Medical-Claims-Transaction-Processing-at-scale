using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using Azure.Identity;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Cosmos.Fluent;
using Constants = CoreClaims.Infrastructure.Constants;

[assembly: FunctionsStartup(typeof(CoreClaims.FunctionApp.Startup))]
namespace CoreClaims.FunctionApp
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            // Setup configuration sources.
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            builder.Services.AddSingleton<IConfiguration>(config);
            builder.Services.Configure<BusinessRuleOptions>(config.GetSection(nameof(BusinessRuleOptions)));

            builder.Services.AddSingleton(s =>
            {
                var endpoint = config[Constants.Connections.CosmosDbEndpoint];

                return new CosmosClientBuilder(endpoint, new DefaultAzureCredential())
                    .Build();
            });

            builder.Services.AddSingleton<IClaimRepository, ClaimRepository>();
            builder.Services.AddSingleton<IAdjudicatorRepository, AdjudicatorRepository>();
            builder.Services.AddSingleton<IMemberRepository, MemberRepository>();
            builder.Services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
            builder.Services.AddSingleton<IPayerRepository, PayerRepository>();
            builder.Services.AddSingleton<IProviderRepository, ProviderRepository>();

            builder.Services.AddSingleton<ICoreBusinessRule, CoreBusinessRule>();
        }
    }
}
