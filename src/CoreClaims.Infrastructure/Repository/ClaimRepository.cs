using CoreClaims.Infrastructure.Domain;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Helpers;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json.Linq;

namespace CoreClaims.Infrastructure.Repository
{
    public class ClaimRepository : CosmosDbRepository, IClaimRepository
    {
        public ClaimRepository(CosmosClient client) :
            base(client, "Claim")
        {
        }

        public async Task<ClaimDetail> GetClaim(string claimId, int? adjustmentId = null)
        {
            if (adjustmentId == null)
            {
                var header = await GetClaimHeader(claimId);
                if (header == null) return null;

                adjustmentId = header.AdjustmentId;
            }

            return await ReadItem<ClaimDetail>(claimId, $"claim:{claimId}:{adjustmentId}");
        }

        public Task<ClaimHeader> GetClaimHeader(string claimId)
        {
            return ReadItem<ClaimHeader>(claimId, $"claim:{claimId}");
        }

        public async Task<IEnumerable<ClaimDetail>> GetClaimDetails(string claimId, int offset = 0, int limit = Constants.DefaultPageSize)
        {
            var queryDetails = new QueryDefinition("SELECT * FROM c WHERE c.claimId = @claimId AND c.type = 'ClaimDetail' OFFSET @offset LIMIT @limit")
                .WithParameter("@claimId", claimId)
                .WithParameter("@offset", offset)
                .WithParameter("@limit", limit);

            return (await Query<ClaimDetail>(queryDetails, new PartitionKey(claimId))).OrderBy(c => c.ModifiedOn).ToList();
        }

        public async Task<ClaimHeader> CreateClaim(ClaimDetail detail)
        {
            //detail.CreatedOn = detail.ModifiedOn = DateTime.UtcNow.ToString();
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
            //detail.ModifiedOn = DateTime.UtcNow.ToString();
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

        public async Task<(ClaimHeader, IEnumerable<ClaimDetail>)> GetClaimHistory(string claimId)
        {
            var query = new QueryDefinition("SELECT * FROM c WHERE c.claimId = @claimId ORDER BY c.modifiedOn DESC")
                .WithParameter("@claimId", claimId);

            var results = await Query<JObject>(query, new PartitionKey(claimId));

            ClaimHeader header = null;
            var details = new List<ClaimDetail>();

            foreach (var row in results)
            {
                var type = row.GetValue("type").ToString();

                switch (type)
                {
                    case ClaimHeader.EntityName:
                        header = row.ToObject<ClaimHeader>();
                        break;
                    case ClaimDetail.EntityName:
                        details.Add(row.ToObject<ClaimDetail>());
                        break;
                }
            }

            return (header, details);
        }
    }
}
