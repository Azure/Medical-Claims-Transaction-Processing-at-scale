using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class AdjudicatorRepository : CosmosDbRepository, IAdjudicatorRepository
    {
        public AdjudicatorRepository(CosmosClient client) :
            base(client, "Adjudicator")
        {
        }

        public Task<IEnumerable<ClaimHeader>> GetAssignedClaims(string adjudicatorId, int offset = 0, int limit = Constants.DefaultPageSize)
        {
            const string sql = @"
                SELECT * FROM c
                WHERE c.adjudicatorId = @adjudicatorId AND c.type = 'ClaimHeader'
                OFFSET @offset LIMIT @limit";

            var query = new QueryDefinition(sql)
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit)
                .WithParameter("@adjudicatorId", adjudicatorId);

            return Query<ClaimHeader>(query);
        }


        public async Task<Adjudicator?> GetRandomAdjudicator(string role = "Adjudicator", int offset = 0, int limit = Constants.DefaultPageSize)
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

        public Task<Adjudicator?> GetAdjudicator(string adjudicatorId)
        {
            return ReadItem<Adjudicator>(adjudicatorId, adjudicatorId);
        }
    }
}
