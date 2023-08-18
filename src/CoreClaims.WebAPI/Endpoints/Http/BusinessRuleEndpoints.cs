using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class BusinessRuleEndpoints
    {
        private readonly IOptions<BusinessRuleOptions> _options;

        public BusinessRuleEndpoints(IOptions<BusinessRuleOptions> options)
        {
            _options = options;
        }

        public void Map(WebApplication app)
        {
            // TODO: Add business rule endpoints here.
        }
    }
}
