using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.ChangeFeedTriggers
{
    public class AssignClaimAdjudicator
    {
        private readonly IClaimRepository _claimRepository;
        private readonly ICoreBusinessRule _coreBusinessRule;

        public AssignClaimAdjudicator(
            IClaimRepository claimRepository,
            ICoreBusinessRule coreBusinessRule)
        {
            _claimRepository = claimRepository;
            _coreBusinessRule = coreBusinessRule;
        }

        [Function("AssignClaimAdjudicator")]
        public async Task Run([CosmosDBTrigger(
            databaseName: Constants.Connections.CosmosDbName,
            containerName: "Claim",
            StartFromBeginning = true,
            Connection = Constants.Connections.CosmosDb,
            LeaseContainerName = "ClaimLeases",
            LeaseContainerPrefix = "ReviewClaim")] IReadOnlyList<ClaimHeader> input,
            FunctionContext context)
        {
            var logger = context.GetLogger<AssignClaimAdjudicator>();
            using var logScope = logger.BeginScope("CosmosDbTrigger: AssignClaimAdjudicator");

            // Get all claims that has initial status.
            var items = input.Where(i => i.Type == ClaimHeader.EntityName &&
                i.ClaimStatus is ClaimStatus.Initial or ClaimStatus.Resubmitted or ClaimStatus.Proposed);

            foreach (var doc in items)
            {
                logger.LogInformation("Processing document " + doc.Id);

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
                        claim = await _coreBusinessRule.AdjudicateClaim(claim);
                        break;
                    }
                }

                // Update claim header and details in Claim container.
                await _claimRepository.UpdateClaim(claim);
            }
        }
    }
}
