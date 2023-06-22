using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;

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
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "member/{memberId}/coverage")] HttpRequest req,
            string memberId,
            ILogger log)
        {
            using (log.BeginScope("HttpTrigger: GetMemberCoverage"))
            {
                var result = await _repository.GetMemberCoverage(memberId);
                var coverage = result.FirstOrDefault();

                return new OkObjectResult(coverage);
            }
        }
    }
}
