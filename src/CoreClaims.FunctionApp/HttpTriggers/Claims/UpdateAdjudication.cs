using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using System;
using System.Linq;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.FunctionApp.HttpTriggers.Claims.Requests;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class UpdateClaimAdjudication
    {
        private readonly IClaimRepository _repository;

        public UpdateClaimAdjudication(IClaimRepository repository)
        {
            _repository = repository;
        }

        [Function("UpdateClaimAdjudication")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", "get", Route = "claim/{claimId}")] HttpRequestData req,
            string claimId,
            FunctionContext context)
        {
            var logger = context.GetLogger<UpdateClaimAdjudication>();
            using (logger.BeginScope("HttpTrigger: UpdateClaimAdjudication"))
            {
                var existing = await _repository.GetClaim(claimId);
                if (existing == null) return req.CreateResponse(HttpStatusCode.NotFound);

                var existingResponse = req.CreateResponse(HttpStatusCode.OK);
                await existingResponse.WriteAsJsonAsync(existing);
                if (req.Method == "GET") return existingResponse;

                if (existing.ClaimStatus is not (ClaimStatus.Acknowledged or ClaimStatus.ApprovalRequired or ClaimStatus.Proposed))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Only claims in the 'Acknowledged', 'ApprovalRequired' or 'Proposed' states may be Adjudicated");
                    return badResponse;
                }
                
                var claimDetail = await req.GetRequest<UpdateClaimModel>();

                if (claimDetail.ClaimStatus is not (ClaimStatus.Proposed or ClaimStatus.Denied))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Claim Status must be set to 'Proposed' or 'Rejected'");
                    return badResponse;
                }

                existing.ClaimStatus = claimDetail.ClaimStatus;
                if (claimDetail.LineItems != null) existing.LineItems = claimDetail.LineItems;
                existing.Comment = claimDetail.Comment ?? string.Empty;

                existing.ModifiedBy = "HttpTrigger/UpdateClaimAdjudication";
                existing.LastAmount = existing.TotalAmount;
                existing.LastAdjudicatedDate = DateTime.UtcNow;

                existing.TotalAmount = existing.LineItems.Sum(m => m.Amount - m.Discount);

                var claim = await _repository.UpdateClaim(existing);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(claim);
                return response;
            }
        }


    }
}
