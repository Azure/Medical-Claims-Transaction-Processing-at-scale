
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.SemanticKernel;
using CoreClaims.WebAPI.Endpoints.Http;
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

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

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

            // TODO: Implement serialization resolver and rules
            //builder.Services.Configure<WorkerOptions>(workerOptions =>
            //{
            //    var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
            //    settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            //    settings.Converters.Add(new StringEnumConverter());
            //    workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
            //});

            // Map the REST endpoints:
            using (var scope = app.Services.CreateScope())
            {
                var service = scope.ServiceProvider.GetService<BusinessRuleEndpoints>();
                service?.Map(app);
            }
            using (var scope = app.Services.CreateScope())
            {
                var service = scope.ServiceProvider.GetService<ClaimsEndpoints>();
                service?.Map(app);
            }
            using (var scope = app.Services.CreateScope())
            {
                var service = scope.ServiceProvider.GetService<MemberEndpoints>();
                service?.Map(app);
            }
            using (var scope = app.Services.CreateScope())
            {
                var service = scope.ServiceProvider.GetService<PayerEndpoints>();
                service?.Map(app);
            }
            using (var scope = app.Services.CreateScope())
            {
                var service = scope.ServiceProvider.GetService<ProviderEndpoints>();
                service?.Map(app);
            }

            app.Run();
        }
    }
}
