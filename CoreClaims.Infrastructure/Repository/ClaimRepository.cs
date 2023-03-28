using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class ClaimRepository : CosmosDbRepository, IClaimRepository
    {
        public ClaimRepository(CosmosClient client) :
            base(client, "Claim")
        {
        }

        public async Task<ClaimDetail?> GetClaim(string claimId, int? adjustmentId = null)
        {
            if (adjustmentId == null)
            {
                var header = await GetClaimHeader(claimId);
                if (header == null) return null;

                adjustmentId = header.AdjustmentId;
            }

            return await ReadItem<ClaimDetail>(claimId, $"claim:{claimId}:{adjustmentId}");
        }

        public Task<ClaimHeader?> GetClaimHeader(string claimId)
        {
            return ReadItem<ClaimHeader>(claimId, $"claim:{claimId}");
        }

        public async Task<IEnumerable<ClaimDetail>> GetClaimDetails(string claimId, int offset = 0, int limit = Constants.DefaultPageSize)
        {
            var queryDetails = new QueryDefinition("SELECT * FROM c WHERE c.claimId = @claimId AND c.type = 'ClaimDetail' OFFSET @offset LIMIT @limit")
                .WithParameter("@claimId", claimId)
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            return (await Query<ClaimDetail>(queryDetails)).OrderBy(c => c.ModifiedOn).ToList();
        }

        public async Task<ClaimHeader> CreateClaim(ClaimDetail detail)
        {
            detail.CreatedOn = detail.ModifiedOn = DateTime.UtcNow;

            var header = new ClaimHeader(detail);

            var batch = Container.CreateTransactionalBatch(new PartitionKey(detail.ClaimId));
            batch.CreateItem(header);
            batch.CreateItem(detail);

            using (var response = await batch.ExecuteAsync())
            {
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception(response.ErrorMessage); // TODO: Better than this
                }

                return response.GetOperationResultAtIndex<ClaimHeader>(0).Resource;
            };
        }

        public async Task<ClaimHeader> UpdateClaim(ClaimDetail detail)
        {
            detail.ModifiedOn = DateTime.UtcNow;
            detail.AdjustmentId++;

            var header = new ClaimHeader(detail);

            var batch = Container.CreateTransactionalBatch(new PartitionKey(detail.ClaimId));
            batch.UpsertItem(header);
            batch.CreateItem(detail);

            using (var response = await batch.ExecuteAsync())
            {
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception(response.ErrorMessage); // TODO: Better than this
                }

                return response.GetOperationResultAtIndex<ClaimHeader>(0).Resource;
            }
        }
    }
}
