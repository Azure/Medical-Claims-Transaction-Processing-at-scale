using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using CoreClaims.Publisher.Helpers;
using System.Linq;
using System.Threading;
using CoreClaims.Infrastructure;
using CoreClaims.Publisher.Services;
using Microsoft.Azure.Cosmos.Spatial;

namespace CoreClaims.Publisher
{
    public class Publisher
    {
        private readonly DataGenerator _dataGenerator;
        private readonly IEventHubService _eventHubService;

        public Publisher(
            DataGenerator dataGenerator,
            IEventHubService eventHubService)
        {
            _dataGenerator = dataGenerator;
            _eventHubService = eventHubService;
        }

        [FunctionName("Publisher")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            int lines = int.TryParse(req.Query["lines"], out lines) ? lines : 5;

            try
            {
                var claimsData = (await _dataGenerator.GenerateClaimsDataAsync(lines)).ToList();

                log.LogInformation("Successfully generated claims data.");

                await _eventHubService.SendDataAsync(Constants.EventHubTopics.Incoming, claimsData);

                log.LogInformation("Successfully published events.");

                return new OkObjectResult(new { data =  claimsData });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { error = ex, message = "Failed to publish CreateClaim events" });
            }
        }
    }
}
