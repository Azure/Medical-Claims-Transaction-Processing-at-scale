using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class ProviderRepository : CosmosDbRepository, IProviderRepository
    {
        public ProviderRepository(CosmosClient client) :
            base(client, "Provider")
        {
        }

        public Task<IEnumerable<Provider>> ListProviders(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            var query = new QueryDefinition("SELECT * FROM c OFFSET @offset LIMIT @limit")
                .WithParameter("@limit", limit)
                .WithParameter("@offset", offset);

            return Query<Provider>(query);
        }

        public Task<Provider> GetProvider(string providerId)
        {
            return ReadItem<Provider>(providerId, providerId);
        }
    }
}
