using System;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.Models.Response;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Serialization.HybridRow;
using System.Net;

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
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "claim/{claimId}/history")] HttpRequestData req,
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
                        return req.CreateResponse(System.Net.HttpStatusCode.NotFound);
                    }

                    var claimHistory = new ClaimHistoryResponse
                    {
                        Header = header,
                        History = details
                    };

                    logger.LogInformation($"Successfully retrieved history of Claim: {claimId}");
                    var response = req.CreateResponse(HttpStatusCode.OK);
                    await response.WriteAsJsonAsync(claimHistory);
                    return response;
                }
                catch (Exception ex)
                {
                    var response = req.CreateResponse(HttpStatusCode.BadRequest);
                    await response.WriteStringAsync(ex.Message);
                    return response;
                }
            }
        }
    }
}
