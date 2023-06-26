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
    public class ListClaimProcedures
    {
        private readonly IClaimProcedureRepository _repository;

        public ListClaimProcedures(IClaimProcedureRepository repository)
        {
            _repository = repository;
        }

        [Function("ListClaimProcedures")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous,
            "get",
            Route = "claim-procedures")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListClaimProcedures>();
            using (logger.BeginScope("HttpTrigger: ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var result = await _repository.ListClaimProcedures(offset, limit);

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);
                return response;
            }
        }
    }
}
