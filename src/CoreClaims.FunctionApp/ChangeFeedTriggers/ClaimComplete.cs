using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Amqp.Framing;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.ChangeFeedTriggers
{
    public class ClaimComplete
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IEventHubService _eventHub;

        public ClaimComplete(
            IMemberRepository memberRepository,
            IEventHubService eventHub)
        {
            _memberRepository = memberRepository;
            _eventHub = eventHub;
        }

        [Function("ClaimComplete")]
        public async Task Run(
            [CosmosDBTrigger(
                databaseName: Constants.Connections.CosmosDbName,
                containerName: "Claim",
                Connection = Constants.Connections.CosmosDb,
                LeaseContainerName = "ClaimLeases",
                LeaseContainerPrefix = "ClaimComplete")] IReadOnlyList<ClaimDetail> input,
            FunctionContext context
            )
        {
            var logger = context.GetLogger<ClaimComplete>();
            using var logScope = logger.BeginScope("CosmosDbTrigger: ClaimComplete");

            try
            {
                foreach (var claim in input.Where(c =>
                             c.Type == ClaimDetail.EntityName &&
                             c.ClaimStatus is ClaimStatus.Approved or ClaimStatus.Denied))
                {
                    switch (claim.ClaimStatus)
                    {
                        case ClaimStatus.Approved:
                            //TODO: Consider moving to workflow ChangeFeed
                            await _memberRepository.IncrementMemberTotals(claim.MemberId, 1, claim.TotalAmount);
                            await _eventHub.TriggerEventAsync(claim, Constants.EventHubTopics.Approved);
                            break;
                        case ClaimStatus.Denied:
                            await _eventHub.TriggerEventAsync(claim, Constants.EventHubTopics.Denied);
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
