using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class PayerEndpoints
    {
        private readonly IPayerRepository _repository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public PayerEndpoints(IPayerRepository repository,
            IOptions<BusinessRuleOptions> options)
        {
            _repository = repository;
            _options = options;
        }

        public void Map(WebApplication app)
        {
            // TODO: Add payer endpoints here.
        }
    }
}
