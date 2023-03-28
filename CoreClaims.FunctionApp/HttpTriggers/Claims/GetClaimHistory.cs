using System;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class GetClaimHistory
    {
        private readonly IClaimRepository _claimRepository;

        public GetClaimHistory(IClaimRepository claimRepository)
        {
            _claimRepository = claimRepository;
        }

        [FunctionName("GetClaimHistory")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "claim/{claimId}/history")] HttpRequest req,
            string claimId,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: GetClaimHistory"))
            {
                try
                {
                    // TODO: Single Request
                    var header = await _claimRepository.GetClaimHeader(claimId);
                    if (header == null)
                    {
                        log.LogError($"Claim {claimId} not found.");
                        return new NotFoundResult();
                    }

                    var details = await _claimRepository.GetClaimDetails(claimId);
                    var claimHistory = new ClaimHistoryResponse
                    {
                        Header = header,
                        History = details
                    };

                    log.LogInformation($"Successfully retrieved history of Claim: {claimId}");
                    return new OkObjectResult(claimHistory);
                }
                catch (Exception ex)
                {
                    return new BadRequestObjectResult(ex.Message);
                }
            }
        }
    }
}
