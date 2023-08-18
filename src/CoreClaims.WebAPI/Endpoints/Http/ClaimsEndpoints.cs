using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class ClaimsEndpoints
    {
        private readonly IClaimRepository _repository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public ClaimsEndpoints(IClaimRepository repository,
            IOptions<BusinessRuleOptions> options)
        {
            _repository = repository;
            _options = options;
        }

        public void Map(WebApplication app)
        {
            // TODO: Add claims endpoints here.
        }
    }
}
