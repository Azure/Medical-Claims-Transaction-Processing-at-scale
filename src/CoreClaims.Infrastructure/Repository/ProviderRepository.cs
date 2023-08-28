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

        public async Task<(IEnumerable<Provider>, int)> ListProviders(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            const string countSql = @"
                            SELECT VALUE COUNT(1) FROM c";

            var countQuery = new QueryDefinition(countSql);

            var countResult = await Container.GetItemQueryIterator<int>(countQuery).ReadNextAsync();
            var count = countResult.Resource.FirstOrDefault();

            var query = new QueryDefinition("SELECT * FROM c OFFSET @offset LIMIT @limit")
                .WithParameter("@limit", limit)
                .WithParameter("@offset", offset);

            var result = await Query<Provider>(query);

            return (result, count);
        }

        public Task<Provider> GetProvider(string providerId)
        {
            return ReadItem<Provider>(providerId, providerId);
        }
    }
}
