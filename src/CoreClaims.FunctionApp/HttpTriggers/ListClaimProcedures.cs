using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListClaimProcedures
    {
        private readonly IClaimProcedureRepository _repository;

        public ListClaimProcedures(IClaimProcedureRepository repository)
        {
            _repository = repository;
        }

        [Function("ListClaimProcedures")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function,
            "get",
            Route = "claim-procedures")] HttpRequest req,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var result = await _repository.ListClaimProcedures(offset, limit);

                return new OkObjectResult(result);
            }
        }
    }
}
