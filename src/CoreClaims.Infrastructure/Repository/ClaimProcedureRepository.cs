using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;
using System.Security.Claims;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public class ClaimProcedureRepository : CosmosDbRepository, IClaimProcedureRepository
    {
        public ClaimProcedureRepository(CosmosClient client) :
            base(client, "ClaimProcedure")
        {
        }

        public async Task<IPageResult<ClaimProcedure>> ListClaimProcedures(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            const string countSql = @"
                            SELECT VALUE COUNT(1) FROM c";

            var countQuery = new QueryDefinition(countSql);

            var countResult = await Container.GetItemQueryIterator<int>(countQuery).ReadNextAsync();
            var count = countResult.Resource.FirstOrDefault();

            QueryDefinition query = new QueryDefinition("SELECT * FROM c OFFSET @offset LIMIT @limit")
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            var result = await Query<ClaimProcedure>(query);
            return new PageResult<ClaimProcedure>(count, offset, limit, result);
        }
    }
}
