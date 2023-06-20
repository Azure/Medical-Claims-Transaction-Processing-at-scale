using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class AcknowledgeClaim
    {
        private readonly IClaimRepository _repository;

        public AcknowledgeClaim(IClaimRepository repository)
        {
            _repository = repository;
        }

        [Function("AcknowledgeClaim")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "claim/{claimId}/acknowledge")] HttpRequest req,
            ILogger log, string claimId)
        {
            using (log.BeginScope("HttpTrigger: AcknowledgeClaim"))
            {
                var claim = await _repository.GetClaim(claimId);

                if (claim == null) return new NotFoundResult();

                if (claim.ClaimStatus is not ClaimStatus.Assigned)
                    return new BadRequestObjectResult("Only claims in the 'Assigned' state may be Acknowledged");

                claim.ClaimStatus = ClaimStatus.Acknowledged;
                claim.Comment = "Claim Acknowledged";

                var result = await _repository.UpdateClaim(claim);

                return new OkObjectResult(result);
            }
        }
    }
}
