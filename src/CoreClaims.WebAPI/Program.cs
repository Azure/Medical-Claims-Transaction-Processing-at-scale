
using Azure.Core.Serialization;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.SemanticKernel;
using CoreClaims.WebAPI.Components;
using CoreClaims.WebAPI.Endpoints.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Azure.Cosmos.Fluent;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace CoreClaims.WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            //builder.Logging.AddApplicationInsights(
            //    configureTelemetryConfiguration: (config) =>
            //        config.ConnectionString = builder.Configuration.GetValue<string>("APPLICATIONINSIGHTS_CONNECTION_STRING"),
            //    configureApplicationInsightsLoggerOptions: (options) => { }
            //);

            // Add services to the container.
            builder.Services.AddAuthorization();

            builder.Services.Configure<BusinessRuleOptions>(builder.Configuration.GetSection(nameof(BusinessRuleOptions)));
            builder.Services.Configure<RulesEngineSettings>(builder.Configuration.GetSection("RulesEngine"));

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

            builder.Services.AddSingleton<IRulesEngine, RulesEngine>();

            // Add Endpoint classes.
            builder.Services.AddScoped<EndpointsBase, AdjudicatorEndpoints>();
            builder.Services.AddScoped<EndpointsBase, BusinessRuleEndpoints>();
            builder.Services.AddScoped<EndpointsBase, ClaimEndpoints>();
            builder.Services.AddScoped<EndpointsBase, ClaimProcedureEndpoints>();
            builder.Services.AddScoped<EndpointsBase, MemberEndpoints>();
            builder.Services.AddScoped<EndpointsBase, PayerEndpoints>();
            builder.Services.AddScoped<EndpointsBase, ProviderEndpoints>();

            // TODO: Implement serialization resolver and rules
            //builder.Services.ConfigureHttpJsonOptions(workerOptions =>
            //{
            //    var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
            //    settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            //    settings.Converters.Add(new StringEnumConverter());
            //    workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
            //});

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            // Map the REST endpoints:
            using (var scope = app.Services.CreateScope())
            {
                // Build collection of all EndpointsBase classes
                var services = scope.ServiceProvider.GetServices<EndpointsBase>();
                // Loop through each EndpointsBase class
                foreach (var item in services)
                {
                    // Invoke the AddRoutes() method to add the routes
                    item.AddRoutes(app);
                }
            }

            app.Run();
        }
    }
}
