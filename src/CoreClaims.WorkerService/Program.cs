using System.Configuration;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WorkerService;
using Microsoft.Azure.Cosmos.Fluent;
using Azure.Identity;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.Configure<BusinessRuleOptions>(builder.Configuration.GetSection(nameof(BusinessRuleOptions)));

builder.Services.AddSingleton(s =>
{
    var endpoint = builder.Configuration[Constants.Connections.CosmosDbEndpoint];
    var clientId = builder.Configuration[Constants.Identity.ClientId];

#if DEBUG
    var credential = new Azure.Identity.DefaultAzureCredential();
#else
    var credential = new ChainedTokenCredential(
            new ManagedIdentityCredential(clientId),
            new AzureCliCredential()
        );
#endif

    return new CosmosClientBuilder(endpoint, credential)
        .Build();
});
builder.Services.AddSingleton<IEventHubService, EventHubService>(s => new EventHubService(
    builder.Configuration[Constants.Connections.EventHubNamespace], builder.Configuration[Constants.Identity.ClientId]));

builder.Services.AddSingleton<IClaimRepository, ClaimRepository>();
builder.Services.AddSingleton<IAdjudicatorRepository, AdjudicatorRepository>();
builder.Services.AddSingleton<IMemberRepository, MemberRepository>();
builder.Services.AddSingleton<IClaimProcedureRepository, ClaimProcedureRepository>();
builder.Services.AddSingleton<IPayerRepository, PayerRepository>();
builder.Services.AddSingleton<IProviderRepository, ProviderRepository>();

builder.Services.AddSingleton<ICoreBusinessRule, CoreBusinessRule>();

builder.Services.AddSingleton<ICosmosDbChangeFeedService, CosmosDbChangeFeedService>();

builder.Services.AddHostedService<ChangeFeedWorker>();
builder.Services.AddHostedService<EventHubWorkerIncomingClaims>();
builder.Services.AddHostedService<EventHubWorkerAdjudicatorChanged>();

var host =builder.Build();

host.Run();
