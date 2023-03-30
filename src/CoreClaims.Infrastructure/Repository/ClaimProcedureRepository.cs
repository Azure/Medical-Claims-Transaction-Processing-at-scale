using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class ClaimProcedureRepository : CosmosDbRepository, IClaimProcedureRepository
    {
        public ClaimProcedureRepository(CosmosClient client) :
            base(client, "ClaimProcedure")
        {
        }

        public Task<IEnumerable<ClaimProcedure>> ListClaimProcedures(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            QueryDefinition query = new QueryDefinition("SELECT * FROM c OFFSET @offset LIMIT @limit")
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            return Query<ClaimProcedure>(query);
        }
    }
}
