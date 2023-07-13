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
    public class ListMemberClaims
    {
        private readonly IMemberRepository _repository;

        public ListMemberClaims(IMemberRepository repository)
        {
            this._repository = repository;
        }

        [Function("ListMemberClaims")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "member/{memberId}/claims")] HttpRequestData req,
            string memberId,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListMemberClaims>();
            using (logger.BeginScope("HttpTrigger: ListMemberClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var (startDate, endDate) = req.GetDateRangeQuery();

                var result = await _repository.ListMemberClaims(memberId, offset, limit, startDate, endDate);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);
                return response;
            }
        }
    }
}
