using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class PayerRepository : CosmosDbRepository, IPayerRepository
    {
        public PayerRepository(CosmosClient client) :
            base(client, "Payer")
        {
        }

        public async Task<IPageResult<Payer>> ListPayers(int offset = 0, int limit = Constants.DefaultPageSize,
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

            var result = await Query<Payer>(query);

            return new PageResult<Payer>(count, offset, limit, result);
        }

        public Task<Payer> GetPayer(string payerId)
        {
            return ReadItem<Payer>(payerId, payerId);
        }
    }
}
