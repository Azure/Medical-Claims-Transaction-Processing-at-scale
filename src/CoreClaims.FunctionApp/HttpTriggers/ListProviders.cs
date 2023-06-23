using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

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
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function,
            "get",
            Route = "providers")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListProviders>();
            using (logger.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var result = await _repository.ListProviders(offset, limit);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);

                return response;
            }
        }
    }
}
