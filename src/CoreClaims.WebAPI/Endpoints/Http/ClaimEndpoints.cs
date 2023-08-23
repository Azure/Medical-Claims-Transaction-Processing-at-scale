using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using Azure;
using CoreClaims.Infrastructure;
using CoreClaims.WebAPI.Models.Response;
using CoreClaims.Infrastructure.Events;
using CoreClaims.SemanticKernel;
using CoreClaims.WebAPI.Models;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class ClaimEndpoints : EndpointsBase
    {
        private readonly IClaimRepository _claimRepository;
        private readonly IOptions<BusinessRuleOptions> _options;
        private readonly IRulesEngine _rulesEngine;
        private readonly IEventHubService _eventHub;

        public ClaimEndpoints(IClaimRepository repository,
            IOptions<BusinessRuleOptions> options,
            IRulesEngine rulesEngine,
            IEventHubService eventHub,
            ILogger<ClaimEndpoints> logger)
        {
            _claimRepository = repository;
            _options = options;
            _rulesEngine = rulesEngine;
            _eventHub = eventHub;
            Logger = logger;
            UrlFragment = "api/claim";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapPost($"/{UrlFragment}/{{claimId}}/acknowledge", async (string claimId) => await AcknowledgeClaim(claimId))
                .WithName("AcknowledgeClaim");
            app.MapGet($"/{UrlFragment}/{{claimId}}/history", async (string claimId) => await GetClaimHistory(claimId))
                .WithName("GetClaimHistory");
            app.MapGet($"/{UrlFragment}/{{claimId}}/recommendation", async (string claimId) => await GetClaimRecommendation(claimId))
                .WithName("GetClaimRecommendation");
            app.MapGet($"/{UrlFragment}/{{claimId}}", async (string claimId) => await GetClaimAdjudication(claimId))
                .WithName("GetClaimAdjudication");
            app.MapPut($"/{UrlFragment}/{{claimId}}", async (string claimId, UpdateClaimModel claimDetail) => await UpdateClaimAdjudication(claimId, claimDetail))
                .WithName("UpdateClaimAdjudication");
        }

        protected virtual async Task<IResult> AcknowledgeClaim(string claimId)
        {
            using (Logger.BeginScope("AcknowledgeClaim"))
            {
                var claim = await _claimRepository.GetClaim(claimId);

                if (claim == null) return Results.NotFound();

                if (claim.ClaimStatus is not ClaimStatus.Assigned)
                {
                    return Results.BadRequest("Only claims in the 'Assigned' state may be Acknowledged");
                }

                claim.ClaimStatus = ClaimStatus.Acknowledged;
                claim.Comment = "Claim Acknowledged";

                // If we are running demo mode and have configured a specific Adjudicator Id, override the adjudicator on acknowledgement.
                if (_options.Value.DemoMode && !string.IsNullOrWhiteSpace(_options.Value.DemoAdjudicatorId))
                {
                    // Only change this if the current adjudicator is not the demo manager adjudicator.
                    if (claim.AdjudicatorId != _options.Value.DemoManagerAdjudicatorId)
                    {
                        claim.AdjudicatorId = _options.Value.DemoAdjudicatorId;
                    }
                }

                var result = await _claimRepository.UpdateClaim(claim);
                return Results.Ok(result);
            }
        }

        protected virtual async Task<IResult> GetClaimHistory(string claimId)
        {
            using (Logger.BeginScope("GetClaimHistory"))
            {
                try
                {
                    // TODO: Single Request
                    var (header, details) = await _claimRepository.GetClaimHistory(claimId);
                    if (header == null)
                    {
                        Logger.LogError($"Claim {claimId} not found.");
                        return Results.NotFound($"Claim {claimId} not found.");
                    }

                    var claimHistory = new ClaimHistoryResponse
                    {
                        Header = header,
                        History = details
                    };

                    Logger.LogInformation($"Successfully retrieved history of Claim: {claimId}");
                    return Results.Ok(claimHistory);
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(ex.Message);
                }
            }
        }

        protected virtual async Task<IResult> GetClaimRecommendation(string claimId)
        {
            using (Logger.BeginScope("HttpTrigger: GetClaimRecommendation"))
            {
                try
                {
                    var claim = await _claimRepository.GetClaim(claimId);
                    if (claim == null)
                    {
                        Logger.LogError($"Claim {claimId} not found.");
                        return Results.NotFound($"Claim {claimId} not found.");
                    }

                    var recommendation = await _rulesEngine.ReviewClaim(claim);

                    Logger.LogInformation($"Successfully retrieved recommendation for Claim: {claimId}");

                    if (recommendation == "Approve")
                        await _eventHub.TriggerEventAsync($"Recommendation for Claim {claimId}: {recommendation}", Constants.EventHubTopics.Approved);
                    return Results.Ok(recommendation);
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(ex.Message);
                }
            }
        }

        protected virtual async Task<IResult> GetClaimAdjudication(string claimId)
        {
            using (Logger.BeginScope("GetClaimAdjudication"))
            {
                var existing = await _claimRepository.GetClaim(claimId);
                if (existing == null) return Results.NotFound();

                return Results.Ok(existing);
            }
        }

        protected virtual async Task<IResult> UpdateClaimAdjudication(string claimId, UpdateClaimModel claimDetail)
        {
            using (Logger.BeginScope("UpdateClaimAdjudication"))
            {
                var existing = await _claimRepository.GetClaim(claimId);
                if (existing == null) return Results.NotFound();

                if (existing.ClaimStatus is not (ClaimStatus.Acknowledged or ClaimStatus.ApprovalRequired or ClaimStatus.Proposed))
                {
                    return Results.BadRequest("Only claims in the 'Acknowledged', 'ApprovalRequired' or 'Proposed' states may be Adjudicated");
                }

                if (claimDetail.ClaimStatus is not (ClaimStatus.Proposed or ClaimStatus.Denied))
                {
                    return Results.BadRequest("Claim Status must be set to 'Proposed' or 'Rejected'");
                }

                existing.ClaimStatus = claimDetail.ClaimStatus;
                if (claimDetail.LineItems != null) existing.LineItems = claimDetail.LineItems;
                existing.Comment = claimDetail.Comment ?? string.Empty;

                existing.ModifiedBy = "HttpTrigger/UpdateClaimAdjudication";
                existing.LastAmount = existing.TotalAmount;
                existing.LastAdjudicatedDate = DateTime.UtcNow;

                existing.TotalAmount = existing.LineItems.Sum(m => m.Amount - m.Discount);

                var claim = await _claimRepository.UpdateClaim(existing);
                return Results.Ok(claim);
            }
        }
    
    }
}
