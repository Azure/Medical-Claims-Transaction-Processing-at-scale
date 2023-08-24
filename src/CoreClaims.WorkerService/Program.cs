using System.Configuration;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WorkerService;
using Microsoft.Azure.Cosmos.Fluent;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.Configure<BusinessRuleOptions>(builder.Configuration.GetSection(nameof(BusinessRuleOptions)));

builder.Services.AddSingleton(s =>
{
    var endpoint = builder.Configuration[Constants.Connections.CosmosDbEndpoint];

    return new CosmosClientBuilder(endpoint, new Azure.Identity.DefaultAzureCredential())
        .Build();
});
builder.Services.AddSingleton<IEventHubService, EventHubService>(s => new EventHubService(
    builder.Configuration[Constants.Connections.EventHubNamespace]));

builder.Services.AddSingleton<IClaimRepository, ClaimRepository>();
builder.Services.AddSingleton<IAdjudicatorRepository, AdjudicatorRepository>();
builder.Services.AddSingleton<IMemberRepository, MemberRepository>();
builder.Services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
builder.Services.AddSingleton<IPayerRepository, PayerRepository>();
builder.Services.AddSingleton<IProviderRepository, ProviderRepository>();

builder.Services.AddSingleton<ICoreBusinessRule, CoreBusinessRule>();

builder.Services.AddSingleton<ICosmosDbChangeFeedService, CosmosDbChangeFeedService>();

builder.Services.AddHostedService<ChangeFeedWorker>();
builder.Services.AddHostedService<EventHubWorker>();

var host =builder.Build();

host.Run();
