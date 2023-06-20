using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.Models.Output;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.ChangeFeedTriggers
{
    public class ClaimComplete
    {
        private readonly IMemberRepository _memberRepository;
        public ClaimComplete(IMemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }

        [Function("ClaimComplete")]
        public async Task<OutputBase> Run(
            [CosmosDBTrigger(
                databaseName: Constants.Connections.CosmosDbName,
                containerName: "Claim",
                Connection = Constants.Connections.CosmosDb,
                LeaseContainerName = "ClaimLeases",
                LeaseContainerPrefix = "ClaimComplete")] IReadOnlyList<ClaimDetail> input,
            ILogger logger
            )
        {
            using var logScope = logger.BeginScope("CosmosDbTrigger: ClaimComplete");

            try
            {
                foreach (var claim in input.Where(c =>
                             c.Type == ClaimDetail.EntityName &&
                             c.ClaimStatus is ClaimStatus.Approved or ClaimStatus.Denied))
                {
                    logger.LogInformation($"Claim {claim.ClaimId} will be published to EventHub/{claim.ClaimStatus}");

                    switch (claim.ClaimStatus)
                    {
                        case ClaimStatus.Approved:
                            //TODO: Consider moving to workflow ChangeFeed
                            await _memberRepository.IncrementMemberTotals(claim.MemberId, 1, claim.TotalAmount);
                            return new ClaimApprovedOutput { Claim = claim };
                        case ClaimStatus.Denied:
                            return new ClaimDeniedOutput { Claim = claim };
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to publish ClaimComplete events");
                throw;
            }
        }
    }
}
