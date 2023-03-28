using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Repository;
using System;
using System.Linq;
using CoreClaims.Infrastructure.Domain.Models;
using CoreClaims.Infrastructure.Domain.Enums;
using System.Web.Http;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class UpdateClaimAdjudication
    {
        private readonly IClaimRepository _repository;

        public UpdateClaimAdjudication(IClaimRepository repository)
        {
            _repository = repository;
        }

        [FunctionName("UpdateClaimAdjudication")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", "get", Route = "claim/{claimId}")] HttpRequest req,
            string claimId,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: UpdateClaimAdjudication"))
            {
                var existing = await _repository.GetClaim(claimId);
                if (existing == null) return new NotFoundResult();

                if (req.Method == "GET") return new OkObjectResult(existing);

                if (existing.ClaimStatus is not ClaimStatus.Acknowledged or ClaimStatus.ApprovalRequired or ClaimStatus.Proposed)
                    return new BadRequestErrorMessageResult("Only claims in the 'Acknowledged', 'ApprovalRequired' or 'Proposed' states may be Adjudicated");

                var claimDetail = await req.GetRequest<UpdateClaimModel>();

                if (claimDetail.ClaimStatus is not ClaimStatus.Proposed or ClaimStatus.Rejected)
                    return new BadRequestErrorMessageResult("Claim Status must be set to 'Proposed' or 'Rejected'");

                existing.ClaimStatus = claimDetail.ClaimStatus;
                if (claimDetail.LineItems != null) existing.LineItems = claimDetail.LineItems;
                existing.Comment = claimDetail.Comment ?? string.Empty;

                existing.ModifiedBy = "HttpTrigger/UpdateClaimAdjudication";
                existing.LastAmount = existing.TotalAmount;
                existing.LastAdjudicatedDate = DateTime.UtcNow;

                existing.TotalAmount = existing.LineItems.Sum(m => m.Amount - m.Discount);

                var claim = await _repository.UpdateClaim(existing);

                return new OkObjectResult(claim);
            }
        }


    }
}
