using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class ProviderEndpoints
    {
        private readonly IProviderRepository _repository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public ProviderEndpoints(IProviderRepository repository,
            IOptions<BusinessRuleOptions> options)
        {
            _repository = repository;
            _options = options;
        }

        public void Map(WebApplication app)
        {
            // TODO: Add provider endpoints here.
        }
    }
}
