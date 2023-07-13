using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class ListAssignedClaims
    {
        private readonly IAdjudicatorRepository repository;

        public ListAssignedClaims(IAdjudicatorRepository repository)
        {
            this.repository = repository;
        }

        [Function("ListAssignedClaims")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "adjudicator/{adjudicatorId}/claims")] HttpRequestData req,
            string adjudicatorId,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListAssignedClaims>();
            using (logger.BeginScope("HttpTrigger: ListAssignedClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await repository.GetAssignedClaims(adjudicatorId, offset, limit);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);
                return response;
            }
        }
    }
}
