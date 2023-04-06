using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.Infrastructure.BusinessRules
{
    public class CoreBusinessRule : ICoreBusinessRule
    {
        private readonly IAdjudicatorRepository _adjudicatorRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public CoreBusinessRule(
            IAdjudicatorRepository adjudicatorRepository,
            IMemberRepository memberRepository,
            IOptions<BusinessRuleOptions> options)
        {
            _adjudicatorRepository = adjudicatorRepository;
            _memberRepository = memberRepository;
            _options = options;
        }

        public async Task<ClaimDetail> AssignClaim(ClaimDetail claim)
        {
            // If claim has no member, set status to Pending.
            if (string.IsNullOrEmpty(claim.MemberId))
            {
                claim.ClaimStatus = ClaimStatus.Pending;
                return claim;
            }

            // Check if member has active coverage.
            // If member has active coverage, check if claim is still covered based on dates.
            // If claim is not valid, set status to Rejected.
            var coverages = await _memberRepository.GetMemberCoverage(claim.MemberId);
            if (!coverages.Any(c => c.StartDate <= claim.FilingDate && c.EndDate >= claim.FilingDate))
            {
                claim.ClaimStatus = ClaimStatus.Denied;
                claim.Comment = "[Automatic] Rejected: Coverage expired or missing";
                return claim;
            }

            // If claim's total amount is less than 200, set status to Approved.
            if (claim.TotalAmount < _options.Value.AutoApproveThreshold)
            {
                claim.ClaimStatus = ClaimStatus.Approved;
                claim.Comment = $"[Automatic] Approved: Less than threshold of {_options.Value.AutoApproveThreshold}";
                return claim;
            }

            // Select random adjudicator.
            if (string.IsNullOrEmpty(claim.AdjudicatorId))
            {
                var adjudicator = await _adjudicatorRepository.GetRandomAdjudicator();
                if (adjudicator != null)
                {
                    // Set Adjudicator to the claim and set status to Assigned.
                    claim.AdjudicatorId = adjudicator.AdjudicatorId;
                    claim.ClaimStatus = ClaimStatus.Assigned;
                    claim.Comment = $"[Automatic] Assigned: Automatically assigned to Adjudicator {adjudicator.AdjudicatorId} ({adjudicator.Role})";
                }
            }

            return claim;
        }

        public async Task<ClaimDetail> AdjudicateClaim(ClaimDetail claim)
        {
            var adjudicator = await _adjudicatorRepository.GetAdjudicator(claim.AdjudicatorId);

            if (adjudicator?.Role == AdjudicatorRole.Manager)
            {
                claim.ClaimStatus = ClaimStatus.Approved;
                claim.Comment = "[Automatic] Approved: Manager Proposed adjustment";
                return claim;
            }

            if (claim.LastAmount.HasValue)
            {
                decimal difference = Math.Abs(claim.LastAmount.Value - claim.TotalAmount);
                if (difference <= _options.Value.RequireManagerApproval)
                {
                    claim.ClaimStatus = ClaimStatus.Approved;
                    claim.Comment = $"[Automatic] Approved: Proposed adjustment below approval threshold {_options.Value.RequireManagerApproval}";
                    return claim;
                }
            }

            var manager = await _adjudicatorRepository.GetRandomAdjudicator("Manager");

            if (manager == null)
                throw new NullReferenceException("Unable to find an appropriate manager to assign approval too");

            claim.PreviousAdjudicatorId = claim.AdjudicatorId;
            claim.AdjudicatorId = manager.Id;
            claim.ClaimStatus = ClaimStatus.ApprovalRequired;
            claim.Comment = "[Automatic] Reassigned: Adjustment requires manager approval";

            return claim;
        }
    }
}
