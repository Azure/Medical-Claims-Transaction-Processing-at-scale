using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListClaimProcedures
    {
        private readonly IClaimProcedureRepository _repository;

        public ListClaimProcedures(IClaimProcedureRepository repository)
        {
            _repository = repository;
        }

        [FunctionName("ListClaimProcedures")]
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
