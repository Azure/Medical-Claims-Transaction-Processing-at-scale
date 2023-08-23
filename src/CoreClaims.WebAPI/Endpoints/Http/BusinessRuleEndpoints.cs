using System.Net;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Azure.Cosmos.Serialization.HybridRow;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class BusinessRuleEndpoints : EndpointsBase
    {
        private readonly IOptions<BusinessRuleOptions> _options;

        public BusinessRuleEndpoints(IOptions<BusinessRuleOptions> options,
            ILogger<BusinessRuleEndpoints> logger)
        {
            _options = options;
            Logger = logger;
            UrlFragment = "api/business-rules";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}", () => Get())
                .WithName("GetBusinessRules");
        }

        protected virtual IResult Get()
        {
            Logger.LogInformation("Getting business rules.");

            return Results.Ok(_options.Value);
        }
    }
}
