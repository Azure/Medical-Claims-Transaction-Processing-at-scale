using System;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.Models.Response;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class GetClaimHistory
    {
        private readonly IClaimRepository _claimRepository;

        public GetClaimHistory(IClaimRepository claimRepository)
        {
            _claimRepository = claimRepository;
        }

        [Function("GetClaimHistory")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "claim/{claimId}/history")] HttpRequest req,
            string claimId,
            FunctionContext context)
        {
            var logger = context.GetLogger<GetClaimHistory>();
            using (logger.BeginScope("HttpTrigger: GetClaimHistory"))
            {
                try
                {
                    // TODO: Single Request
                    var (header, details) = await _claimRepository.GetClaimHistory(claimId);
                    if (header == null)
                    {
                        logger.LogError($"Claim {claimId} not found.");
                        return new NotFoundResult();
                    }

                    var claimHistory = new ClaimHistoryResponse
                    {
                        Header = header,
                        History = details
                    };

                    logger.LogInformation($"Successfully retrieved history of Claim: {claimId}");
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
