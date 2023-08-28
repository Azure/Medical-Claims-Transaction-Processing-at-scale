using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class ProviderRepository : CosmosDbRepository, IProviderRepository
    {
        public ProviderRepository(CosmosClient client) :
            base(client, "Provider")
        {
        }

        public async Task<IPageResult<Provider>> ListProviders(int offset = 0, int limit = Constants.DefaultPageSize,
            string sortColumn = "_ts",
            string sortDirection = "asc")
        {
            const string countSql = @"
                            SELECT VALUE COUNT(1) FROM c";

            var countQuery = new QueryDefinition(countSql);

            var countResult = await Container.GetItemQueryIterator<int>(countQuery).ReadNextAsync();
            var count = countResult.Resource.FirstOrDefault();

            var query = new QueryDefinition($"SELECT * FROM c ORDER BY c.{sortColumn} {sortDirection} OFFSET @offset LIMIT @limit")
                .WithParameter("@limit", limit)
                .WithParameter("@offset", offset);

            var result = await Query<Provider>(query);

            return new PageResult<Provider>(count, offset, limit, result);
        }

        public Task<Provider> GetProvider(string providerId)
        {
            return ReadItem<Provider>(providerId, providerId);
        }
    }
}
