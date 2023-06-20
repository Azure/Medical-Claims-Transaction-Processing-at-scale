using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.Models.Output;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.ChangeFeedTriggers
{
    public class ClaimUpdated
    {
        [Function("ClaimUpdated")]
        public async Task<OutputBase> Run(
            [CosmosDBTrigger(databaseName: Constants.Connections.CosmosDbName,
                containerName: "Claim",
                Connection = Constants.Connections.CosmosDb,
                LeaseContainerName = "ClaimLeases",
                LeaseContainerPrefix = "PropagateClaimHeader")] IReadOnlyList<ClaimHeader> input,
            [CosmosDBOutput(databaseName: Constants.Connections.CosmosDbName,
                containerName: "Member",
                Connection = Constants.Connections.CosmosDb)] IAsyncCollector<ClaimHeader> members,
            [CosmosDBOutput(databaseName: Constants.Connections.CosmosDbName,
                containerName: "Adjudicator",
                Connection = Constants.Connections.CosmosDb)] IAsyncCollector<ClaimHeader> adjudicator,
            ILogger logger)
        {
            using var logScope = logger.BeginScope("CosmosDbTrigger: ClaimUpdated");

            var headers = input.Where(i => i.Type == ClaimHeader.EntityName);

            foreach (var claim in headers)
            {
                if (!string.IsNullOrEmpty(claim.MemberId))
                {
                    logger.LogInformation($"Updating ClaimHeader/{claim.ClaimId}/{claim.AdjustmentId} for Member/{claim.MemberId}");
                    return new ClaimToMemberOutput { Claim = claim };
                }

                if (!string.IsNullOrEmpty(claim.AdjudicatorId))
                {
                    await adjudicator.AddAsync(claim);
                    logger.LogInformation($"Updating ClaimHeader/{claim.ClaimId}/{claim.AdjustmentId} for Adjudicator/{claim.AdjudicatorId}");
                }
            }
        }
    }
}
