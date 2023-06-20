using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using CoreClaims.FunctionApp.Models.Response;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.SemanticKernel;
using Microsoft.Azure.Functions.Worker;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class GetClaimRecommendation
    {
        private readonly IClaimRepository _claimRepository;
        private readonly IRulesEngine _rulesEngine;

        public GetClaimRecommendation(IClaimRepository claimRepository, IRulesEngine rulesEngine)
        {
            _claimRepository = claimRepository;
            _rulesEngine = rulesEngine;
        }

        [Function("GetClaimRecommendation")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "claim/{claimId}/recommendation")] HttpRequest req,
            string claimId,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: GetClaimRecommendation"))
            {
                try
                {
                    var claim = await _claimRepository.GetClaim(claimId);
                    if (claim == null)
                    {
                        log.LogError($"Claim {claimId} not found.");
                        return new NotFoundResult();
                    }

                    var recommendation = await _rulesEngine.ReviewClaim(claim);

                    log.LogInformation($"Successfully retrieved recommendation for Claim: {claimId}");
                    return new OkObjectResult(recommendation);
                }
                catch (Exception ex)
                {
                    return new BadRequestObjectResult(ex.Message);
                }
            }
        }
    }
}
