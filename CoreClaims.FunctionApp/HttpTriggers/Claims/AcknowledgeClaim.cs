using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class AcknowledgeClaim
    {
        private readonly IClaimRepository _repository;

        public AcknowledgeClaim(IClaimRepository repository)
        {
            _repository = repository;
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

                if (claim.ClaimStatus != ClaimStatus.Assigned)
                    return new BadRequestErrorMessageResult("Only claims in the 'Assigned' state may be Acknowledged");

                claim.ClaimStatus = ClaimStatus.Acknowledged;
                claim.Comment = "Claim Acknowledged";

                var result = await _repository.UpdateClaim(claim);

                return new OkObjectResult(result);
            }
        }
    }
}
