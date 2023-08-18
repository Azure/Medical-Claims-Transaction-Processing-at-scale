using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class MemberEndpoints
    {
        private readonly IMemberRepository _repository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public MemberEndpoints(IMemberRepository repository,
            IOptions<BusinessRuleOptions> options)
        {
            _repository = repository;
            _options = options;
        }

        public void Map(WebApplication app)
        {
            // TODO: Add member endpoints here.
        }
    }
}
