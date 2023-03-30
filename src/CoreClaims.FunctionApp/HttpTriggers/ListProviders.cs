using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListProviders
    {
        private readonly IProviderRepository _repository;

        public ListProviders(IProviderRepository repository)
        {
            _repository = repository;
        }

        [FunctionName("ListProviders")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function,
            "get",
            Route = "providers")] HttpRequest req,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var result = await _repository.ListProviders(offset, limit);

                return new OkObjectResult(result);
            }
        }
    }
}
