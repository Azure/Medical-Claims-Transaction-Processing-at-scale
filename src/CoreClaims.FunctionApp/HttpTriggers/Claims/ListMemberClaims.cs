using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;

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
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "member/{memberId}/claims")] HttpRequest req,
            string memberId,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListMemberClaims>();
            using (logger.BeginScope("HttpTrigger: ListMemberClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var (startDate, endDate) = req.GetDateRangeQuery();

                var result = await _repository.ListMemberClaims(memberId, offset, limit, startDate, endDate);

                return new OkObjectResult(result);
            }
        }
    }
}
