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
    public class ListMembers
    {
        private readonly IMemberRepository _repository;

        public ListMembers(IMemberRepository repository)
        {
            _repository = repository;
        }

        [Function("ListMembers")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "members")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger<ListMembers>();
            using (logger.BeginScope("HttpTrigger: ListMembers"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListMembers(offset, limit);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(result);

                return response;
            }
        }
    }
}
