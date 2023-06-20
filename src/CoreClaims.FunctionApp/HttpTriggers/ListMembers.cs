using System.Threading.Tasks;
using CoreClaims.Infrastructure.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListMembers
    {
        private readonly IMemberRepository _repository;

        public ListMembers(IMemberRepository repository)
        {
            _repository = repository;
        }

        [Function("ListMembers")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "member")] HttpRequest req,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListMembers(offset, limit);
                return new OkObjectResult(result);
            }
        }
    }
}
