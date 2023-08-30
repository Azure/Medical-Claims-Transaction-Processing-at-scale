using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Serialization.HybridRow.Schemas;

namespace CoreClaims.Infrastructure.Repository
{
    public class AdjudicatorRepository : CosmosDbRepository, IAdjudicatorRepository
    {
        public AdjudicatorRepository(CosmosClient client) :
            base(client, "Adjudicator")
        {
        }

        public async Task<IPageResult<ClaimHeader>> GetAssignedClaims(string adjudicatorId,
            int offset = 0,
            int limit = Constants.DefaultPageSize,
            string sortColumn = Constants.DefaultSortColumn,
            string sortDirection = "asc")
        {
            sortColumn ??= Constants.DefaultSortColumn;
            const string countSql = @"
                            SELECT VALUE COUNT(1) FROM c
                            WHERE c.adjudicatorId = @adjudicatorId AND c.type = 'ClaimHeader'";

            var countQuery = new QueryDefinition(countSql)
                .WithParameter("@adjudicatorId", adjudicatorId);

            var countResult = await Container.GetItemQueryIterator<int>(countQuery).ReadNextAsync();
            var count = countResult.Resource.FirstOrDefault();

            // Update the original query to include the count query parameters and return the results as a tuple
            string sql = @$"
                            SELECT * FROM c
                            WHERE c.adjudicatorId = @adjudicatorId AND c.type = 'ClaimHeader'
                            ORDER BY c.{sortColumn} {sortDirection}
                            OFFSET @offset LIMIT @limit";

            var query = new QueryDefinition(sql)
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit)
                .WithParameter("@adjudicatorId", adjudicatorId);

            var result = await Query<ClaimHeader>(query);

            return new PageResult<ClaimHeader>(count, offset, limit, result);
        }


        public async Task<Adjudicator> GetRandomAdjudicator(string role = "Adjudicator", int offset = 0, int limit = Constants.DefaultPageSize)
        {
            var query = new QueryDefinition("SELECT * FROM a WHERE a.role = @role AND a.type = 'Adjudicator' OFFSET @offset LIMIT @limit")
                .WithParameter("@role", role)
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            var result = (await Query<Adjudicator>(query)).ToList();

            if (result.Any())
            {
                return result.ElementAt(new Random().Next(1, result.Count) - 1);
            }

            return null;
        }

        public Task<Adjudicator> GetAdjudicator(string adjudicatorId)
        {
            return ReadItem<Adjudicator>(adjudicatorId, adjudicatorId);
        }

        public Task<ClaimHeader> GetAdjudicatorClaim(string adjudicatorId, string id)
        {
            return ReadItem<ClaimHeader>(adjudicatorId, id);
        }

        public async Task DeleteAdjudicatorClaim(string adjudicatorId, string id)
        {
            await Container.DeleteItemAsync<ClaimHeader>(id, new Microsoft.Azure.Cosmos.PartitionKey(adjudicatorId));
        }

        public async Task UpsertClaim(ClaimHeader claim)
        {
            await Container.UpsertItemAsync(claim);
        }
    }
}
