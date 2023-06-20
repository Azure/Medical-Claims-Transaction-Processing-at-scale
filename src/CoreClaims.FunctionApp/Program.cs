using AzureIdentity = Azure.Identity;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.SemanticKernel;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CoreClaims.Infrastructure;
using Microsoft.Extensions.Configuration;
using System.IO;

//// Setup configuration sources.
//var config = new ConfigurationBuilder()
//    .SetBasePath(Directory.GetCurrentDirectory())
//    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
//    .AddJsonFile("settings.json", optional: true, reloadOnChange: true)
//    .AddEnvironmentVariables()
//    .Build();


var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((hostContext,services) =>
    {
        services.Configure<BusinessRuleOptions>(hostContext.Configuration.GetSection(nameof(BusinessRuleOptions)));

        services.AddSingleton(s =>
        {
            var endpoint = hostContext.Configuration[Constants.Connections.CosmosDbEndpoint];

            return new CosmosClientBuilder(endpoint, new AzureIdentity.DefaultAzureCredential())
                .Build();
        });

        services.AddSingleton<IClaimRepository, ClaimRepository>();
        services.AddSingleton<IAdjudicatorRepository, AdjudicatorRepository>();
        services.AddSingleton<IMemberRepository, MemberRepository>();
        services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
        services.AddSingleton<IPayerRepository, PayerRepository>();
        services.AddSingleton<IProviderRepository, ProviderRepository>();

        services.AddSingleton<ICoreBusinessRule, CoreBusinessRule>();

        services.AddSingleton<IRulesEngine, RulesEngine>();
    })
    .Build();

await host.RunAsync();
