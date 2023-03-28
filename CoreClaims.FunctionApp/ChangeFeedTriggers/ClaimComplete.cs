using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.WebJobs;
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

        [FunctionName("ClaimComplete")]
        public async Task Run(
            [CosmosDBTrigger(
                databaseName: Constants.Connections.CosmosDbName,
                containerName: "Claim",
                Connection = Constants.Connections.CosmosDb,
                LeaseContainerName = "ClaimLeases",
                LeaseContainerPrefix = "ClaimComplete")] IReadOnlyList<ClaimDetail> input,
            [EventHub(Constants.EventHubTopics.Approved,
                Connection = Constants.Connections.EventHub)] IAsyncCollector<ClaimDetail> approved,
            [EventHub(Constants.EventHubTopics.Denied,
                Connection = Constants.Connections.EventHub)] IAsyncCollector<ClaimDetail> denied,
            ILogger logger
            )
        {
            using var logScope = logger.BeginScope("CosmosDbTrigger: ClaimComplete");

            try
            {
                foreach (var claim in input.Where(c =>
                             c.Type == ClaimDetail.EntityName &&
                             c.ClaimStatus is ClaimStatus.Approved or ClaimStatus.Rejected))
                {
                    switch (claim.ClaimStatus)
                    {
                        case ClaimStatus.Approved:
                            //TODO: Consider moving to workflow ChangeFeed
                            await _memberRepository.IncrementMemberTotals(claim.MemberId, 1, claim.TotalAmount);
                            await approved.AddAsync(claim);
                            break;
                        case ClaimStatus.Rejected:
                            await denied.AddAsync(claim);
                            break;
                    }

                    logger.LogInformation($"Claim {claim.ClaimId} published to EventHub/{claim.ClaimStatus}");
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
