using System.Net;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using CoreClaims.Infrastructure.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class ListPayers
    {
        private readonly IPayerRepository _repository;

        public ListPayers(IPayerRepository repository)
        {
            _repository = repository;
        }

        [Function("ListPayers")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "payers")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListPayers>();
            using (logger.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListPayers(offset, limit);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);
                
                return response;
            }
        }
    }
}
