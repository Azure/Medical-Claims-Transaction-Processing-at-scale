using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Abstractions;
using Newtonsoft.Json.Linq;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.Infrastructure.Helpers;

namespace CoreClaims.Infrastructure.Events
{
    public class CosmosDbChangeFeedService : ICosmosDbChangeFeedService
    {
        private readonly CosmosClient _client;
        private readonly Database _database;
        private readonly Container _leases;
        private readonly Container _claim;

        private ChangeFeedProcessor _changeFeedProcessorAssignClaimAdjudicator;
        private ChangeFeedProcessor _changeFeedProcessorClaimComplete;
        private ChangeFeedProcessor _changeFeedProcessorAssignClaimUpdated;

        private readonly ILogger<CosmosDbChangeFeedService> _logger;
        private readonly IClaimRepository _claimRepository;
        private readonly ICoreBusinessRule _coreBusinessRule;
        private readonly IAdjudicatorRepository _adjudicatorRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IEventHubService _eventHub;

        private bool _changeFeedsInitialized = false;

        public bool IsInitialized => _changeFeedsInitialized;

        public CosmosDbChangeFeedService(CosmosClient client,
            ILogger<CosmosDbChangeFeedService> logger,
            IClaimRepository claimRepository,
            ICoreBusinessRule coreBusinessRule,
            IAdjudicatorRepository adjudicatorRepository,
            IMemberRepository memberRepository,
            IEventHubService eventHub)
        {
            _client = client;
            _claimRepository = claimRepository;
            _coreBusinessRule = coreBusinessRule;
            _adjudicatorRepository = adjudicatorRepository;
            _memberRepository = memberRepository;
            _eventHub = eventHub;
            _logger = logger;

            var database = _client.GetDatabase(Constants.Connections.CosmosDbName);

            _database = database ??
                        throw new ArgumentException("Unable to connect to existing Azure Cosmos DB database.");

            _claim = database?.GetContainer("Claim") ??
                        throw new ArgumentException("Unable to connect to existing Azure Cosmos DB container or database.");
            _leases = database?.GetContainer("ClaimLeases") ??
                      throw new ArgumentException("Unable to connect to existing Azure Cosmos DB container or database.");

            //Task.Run(() => StartChangeFeedProcessorsAsync());
        }

        public async Task StartChangeFeedProcessorsAsync()
        {
            try
            {
                _changeFeedProcessorAssignClaimAdjudicator = _claim
                    .GetChangeFeedProcessorBuilder<ClaimHeader>("AssignClaimAdjudicator", AssignClaimAdjudicatorChangeFeedHandler)
                    .WithInstanceName("ReviewClaim")
                    .WithLeaseContainer(_leases)
                    .WithStartTime(DateTime.MinValue.ToUniversalTime()) // Read from the beginning.
                    .Build();
                _changeFeedProcessorClaimComplete = _claim
                    .GetChangeFeedProcessorBuilder<ClaimDetail>("ClaimComplete", ClaimCompleteChangeFeedHandler)
                    .WithInstanceName("ClaimComplete")
                    .WithLeaseContainer(_leases)
                    .WithStartTime(DateTime.MinValue.ToUniversalTime()) // Read from the beginning.
                    .Build();
                _changeFeedProcessorAssignClaimUpdated = _claim
                    .GetChangeFeedProcessorBuilder<ClaimHeader>("ClaimUpdated", ClaimUpdatedChangeFeedHandler)
                    .WithInstanceName("PropagateClaimHeader")
                    .WithLeaseContainer(_leases)
                    .WithStartTime(DateTime.MinValue.ToUniversalTime()) // Read from the beginning.
                    .Build();

                await _changeFeedProcessorAssignClaimAdjudicator.StartAsync();
                await _changeFeedProcessorClaimComplete.StartAsync();
                await _changeFeedProcessorAssignClaimUpdated.StartAsync();
                
                _changeFeedsInitialized = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing change feed processors.");
            }
        }

        public async Task StopChangeFeedProcessorAsync()
        {
            // Stop the ChangeFeedProcessor
            _logger.LogInformation("Stopping Change Feed Processors...");

            if (_changeFeedProcessorAssignClaimAdjudicator != null) await _changeFeedProcessorAssignClaimAdjudicator.StopAsync();
            if (_changeFeedProcessorClaimComplete != null) await _changeFeedProcessorClaimComplete.StopAsync();
            if (_changeFeedProcessorAssignClaimUpdated != null) await _changeFeedProcessorAssignClaimUpdated.StopAsync();

            _logger.LogInformation("Change Feed Processors stopped.");
        }

        private async Task AssignClaimAdjudicatorChangeFeedHandler(
            ChangeFeedProcessorContext context,
            IReadOnlyCollection<ClaimHeader> input,
            CancellationToken cancellationToken)
        {
            using var logScope = _logger.BeginScope("CosmosDbTrigger: AssignClaimAdjudicator");

            // Get all claims that has initial status.
            var items = input.Where(i => i.Type == ClaimHeader.EntityName &&
                                         i.ClaimStatus is ClaimStatus.Initial or ClaimStatus.Resubmitted or ClaimStatus.Proposed);

            foreach (var doc in items)
            {
                _logger.LogInformation("Processing document " + doc.Id);

                // Get claim detail to update.
                var claim = await _claimRepository.GetClaim(doc.ClaimId, doc.AdjustmentId);
                if (claim == null) throw new ArgumentException($"Claim '{doc.ClaimId}' missing", nameof(doc.ClaimId));

                claim.ModifiedBy = "ChangeFeed/Adjudication";

                switch (doc.ClaimStatus)
                {
                    case ClaimStatus.Initial:
                    case ClaimStatus.Resubmitted:
                    {
                        // Assign claim to an adjudicator based on business rule.
                        claim = await _coreBusinessRule.AssignClaim(claim);
                        break;
                    }

                    case ClaimStatus.Proposed:
                    {
                        // Adjudicate claim.
                        //Create a copy of the claim and name it as "Proposed" claim.
                        var proposedClaim = new ClaimHeader(claim);
                        (claim, var adjudicatorChanged) = await _coreBusinessRule.AdjudicateClaim(claim);
                        if (adjudicatorChanged)
                        {
                            // Raise event to notify adjudicator change.
                            await _eventHub.TriggerEventAsync(proposedClaim, Constants.EventHubTopics.AdjudicatorChanged);
                        }
                        break;
                    }
                }

                // Update claim header and details in Claim container.
                await _claimRepository.UpdateClaim(claim);
            }
        }

        private async Task ClaimCompleteChangeFeedHandler(
            ChangeFeedProcessorContext context,
            IReadOnlyCollection<ClaimDetail> input,
            CancellationToken cancellationToken)
        {
            using var logScope = _logger.BeginScope("CosmosDbTrigger: ClaimComplete");

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

                    _logger.LogInformation($"Claim {claim.ClaimId} published to EventHub/{claim.ClaimStatus}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish ClaimComplete events");
                throw;
            }
        }

        private async Task ClaimUpdatedChangeFeedHandler(
            ChangeFeedProcessorContext context,
            IReadOnlyCollection<ClaimHeader> input,
            CancellationToken cancellationToken)
        {
            using var logScope = _logger.BeginScope("CosmosDbTrigger: ClaimUpdated");

            var headers = input.Where(i => i.Type == ClaimHeader.EntityName);

            foreach (var claim in headers)
            {
                if (!string.IsNullOrEmpty(claim.MemberId))
                {
                    await _memberRepository.UpsertClaim(claim);
                    _logger.LogInformation($"Updating ClaimHeader/{claim.ClaimId}/{claim.AdjustmentId} for Member/{claim.MemberId}");
                }

                if (!string.IsNullOrEmpty(claim.AdjudicatorId))
                {
                    await _adjudicatorRepository.UpsertClaim(claim);
                    _logger.LogInformation($"Updating ClaimHeader/{claim.ClaimId}/{claim.AdjustmentId} for Adjudicator/{claim.AdjudicatorId}");
                }
            }
        }

    }
}
