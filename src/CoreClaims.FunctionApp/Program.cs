using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.SemanticKernel;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CoreClaims.Infrastructure;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Text.Json.Serialization;
using Azure.Core.Serialization;
using Microsoft.Extensions.Azure;
using CoreClaims.Infrastructure.Events;
using Microsoft.Azure.Functions.Worker;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.Services.AddLogging();
    })
    .ConfigureAppConfiguration(con =>
    {
        con.AddUserSecrets<Program>(optional: true, reloadOnChange: false);
        con.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
    })
    .ConfigureServices((hostContext, services) =>
    {
        services.Configure<BusinessRuleOptions>(hostContext.Configuration.GetSection(nameof(BusinessRuleOptions)));
        services.Configure<RulesEngineSettings>(hostContext.Configuration.GetSection("RulesEngine"));

        services.AddSingleton(s =>
        {
            var endpoint = hostContext.Configuration[Constants.Connections.CosmosDbEndpoint];

            return new CosmosClientBuilder(endpoint, new Azure.Identity.DefaultAzureCredential())
                .Build();
        });
        services.AddSingleton<IEventHubService, EventHubService>(s => new EventHubService(
            hostContext.Configuration[Constants.Connections.EventHubNamespace]));

        services.AddSingleton<IClaimRepository, ClaimRepository>();
        services.AddSingleton<IAdjudicatorRepository, AdjudicatorRepository>();
        services.AddSingleton<IMemberRepository, MemberRepository>();
        services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
        services.AddSingleton<IPayerRepository, PayerRepository>();
        services.AddSingleton<IProviderRepository, ProviderRepository>();

        services.AddSingleton<ICoreBusinessRule, CoreBusinessRule>();

        services.AddSingleton<IRulesEngine, RulesEngine>();

        services.Configure<WorkerOptions>(workerOptions =>
        {
            var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.Converters.Add(new StringEnumConverter());
            workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
        });
    })
    .Build();

await host.RunAsync();
