using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace CoreClaims.FunctionApp.HttpTriggers.Claims
{
    public class GetMemberCoverage
    {
        private readonly IMemberRepository _repository;

        public GetMemberCoverage(IMemberRepository repository)
        {
            this._repository = repository;
        }

        [Function("GetMemberCoverage")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "member/{memberId}/coverage")] HttpRequestData req,
            string memberId,
            FunctionContext context)
        {
            var logger = context.GetLogger<GetMemberCoverage>();
            using (logger.BeginScope("HttpTrigger: GetMemberCoverage"))
            {
                var result = await _repository.GetMemberCoverage(memberId);
                var coverage = result.FirstOrDefault();

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(coverage);
                return response;
            }
        }
    }
}
