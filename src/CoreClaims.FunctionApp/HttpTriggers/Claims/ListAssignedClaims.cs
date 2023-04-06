using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class ListAssignedClaims
    {
        private readonly IAdjudicatorRepository repository;

        public ListAssignedClaims(IAdjudicatorRepository repository)
        {
            this.repository = repository;
        }

        [FunctionName("ListAssignedClaims")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "adjudicator/{adjudicatorId}/claims")] HttpRequest req,
            string adjudicatorId,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: ListAssignedClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await repository.GetAssignedClaims(adjudicatorId, offset, limit);
                return new OkObjectResult(result);
            }
        }
    }
}
