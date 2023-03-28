using CoreClaims.Infrastructure.Repository;
using CoreClaims.Publisher.Helpers;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using CoreClaims.Infrastructure;
using Azure.Identity;
using CoreClaims.Publisher.Services;
using Microsoft.Azure.Cosmos.Fluent;

[assembly: FunctionsStartup(typeof(CoreClaims.Publisher.Startup))]
namespace CoreClaims.Publisher
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            // Setup configuration sources.
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            builder.Services.AddSingleton<IConfiguration>(config);

            builder.Services.AddSingleton(s =>
            {
                var endpoint = config[Constants.Connections.CosmosDbEndpoint];

                return new CosmosClientBuilder(endpoint, new DefaultAzureCredential())
                    .Build();
            });

            builder.Services.AddSingleton<IMemberRepository, MemberRepository>();
            builder.Services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
            builder.Services.AddSingleton<IPayerRepository, PayerRepository>();
            builder.Services.AddSingleton<IProviderRepository, ProviderRepository>();

            builder.Services.AddSingleton<IEventHubService>(sp => new EventHubService(config[Constants.Connections.EventHubNamespace]));
            builder.Services.AddSingleton<DataGenerator>();
        }
    }
}
