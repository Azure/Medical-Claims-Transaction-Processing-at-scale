using System.Net;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class BusinessRuleEndpoints
    {
        private readonly IOptions<BusinessRuleOptions> _options;
        private readonly ILogger _logger;

        public BusinessRuleEndpoints(IOptions<BusinessRuleOptions> options,
            ILogger<BusinessRuleEndpoints> logger)
        {
            _options = options;
            _logger = logger;
        }

        public void Map(WebApplication app)
        {
            app.MapGet("/business-rules/", async context =>
                {
                    var logger = app.ApplicationServices.GetRequiredService<ILogger<BusinessRuleEndpoints>>();
                    using (logger.BeginScope("HttpTrigger: GetBusinessRules"))
                    {
                        if (_options == null)
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                            return;
                        }

                        var response = await context.Response.WriteAsJsonAsync(_options.Value);

                        if (!response.IsSuccessStatusCode)
                        {
                            logger.LogError($"Error occurred: {response}");
                        }
                    }
                }).WithName("GetBusinessRules");
        }
    }
}
