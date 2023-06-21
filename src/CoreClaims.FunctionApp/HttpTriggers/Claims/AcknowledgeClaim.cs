using System.Threading.Tasks;
using System.Web.Http;
using CoreClaims.Infrastructure.BusinessRules;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Extensions.Options;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class AcknowledgeClaim
    {
        private readonly IClaimRepository _repository;
        private readonly IOptions<BusinessRuleOptions> _options;

        public AcknowledgeClaim(IClaimRepository repository,
            IOptions<BusinessRuleOptions> options)
        {
            _repository = repository;
            _options = options;
        }

        [FunctionName("AcknowledgeClaim")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "claim/{claimId}/acknowledge")] HttpRequest req,
            ILogger log, string claimId)
        {
            using (log.BeginScope("HttpTrigger: AcknowledgeClaim"))
            {
                var claim = await _repository.GetClaim(claimId);
                if (claim == null) return new NotFoundResult();

                if (claim.ClaimStatus is not ClaimStatus.Assigned)
                    return new BadRequestErrorMessageResult("Only claims in the 'Assigned' state may be Acknowledged");

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

                var result = await _repository.UpdateClaim(claim);

                return new OkObjectResult(result);
            }
        }
    }
}
