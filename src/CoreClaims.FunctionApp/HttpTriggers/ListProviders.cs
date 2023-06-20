using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListProviders
    {
        private readonly IProviderRepository _repository;

        public ListProviders(IProviderRepository repository)
        {
            _repository = repository;
        }

        [Function("ListProviders")]
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
