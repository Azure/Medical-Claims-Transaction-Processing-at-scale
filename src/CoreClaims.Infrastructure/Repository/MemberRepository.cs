using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class MemberRepository : CosmosDbRepository, IMemberRepository
    {
        public MemberRepository(CosmosClient client) :
            base(client, "Member")
        {
        }

        public async Task<IEnumerable<ClaimHeader>> ListMemberClaims(
            string memberId,
            int offset = 0,
            int limit = Constants.DefaultPageSize,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            string sql;
            QueryDefinition query;

            if (startDate != null && endDate != null)
            {
                sql = @"
                    SELECT * FROM m
                    WHERE m.memberId = @memberId AND m.type = 'ClaimHeader' AND
                          m.filingDate >= @startDate AND m.filingDate <= @endDate
                    OFFSET @offset LIMIT @limit";

                query = new QueryDefinition(sql)
                    .WithParameter("@memberId", memberId)
                    .WithParameter("@offset", offset)
                    .WithParameter("@limit", limit)
                    .WithParameter("@startDate", startDate)
                    .WithParameter("@endDate", endDate);
            }
            else
            {
                sql = @"
                    SELECT * FROM m
                    WHERE m.memberId = @memberId AND m.type = 'ClaimHeader'
                    OFFSET @offset LIMIT @limit";

                query = new QueryDefinition(sql)
                    .WithParameter("@memberId", memberId)
                    .WithParameter("@offset", offset)
                    .WithParameter("@limit", limit);
            }

            return await Query<ClaimHeader>(query);
        }

        public Task<IEnumerable<Coverage>> GetMemberCoverage(string memberId)
        {
            var query = new QueryDefinition("SELECT * FROM m WHERE m.memberId = @memberId AND m.type = 'Coverage'")
                .WithParameter("@memberId", memberId);

            return Query<Coverage>(query);
        }

        public Task<IEnumerable<Member>> ListMembers(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            QueryDefinition query = new QueryDefinition("SELECT * FROM m WHERE m.type = 'Member' OFFSET @offset LIMIT @limit")
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            return Query<Member>(query);
        }

        public async Task<Member> IncrementMemberTotals(string memberId, int count, decimal amount)
        {
            var response = await Container.PatchItemAsync<Member>(memberId, new PartitionKey(memberId),
                patchOperations: new[]
                {
                    PatchOperation.Increment("/approvedCount", count),
                    PatchOperation.Increment("/approvedTotal", decimal.ToDouble(amount)),
                    PatchOperation.Replace("/modifiedBy", "System/IncrementTotals"),
                    PatchOperation.Replace("/modifiedOn", DateTime.UtcNow), 
                });

            return response.Resource;
        }
    }
}
