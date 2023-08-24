using CoreClaims.Infrastructure.Events;

namespace ClaimsWorkerService
{
    public class ChangeFeedWorker : BackgroundService
    {
        private readonly ILogger<ChangeFeedWorker> _logger;
        private readonly ICosmosDbChangeFeedService _cosmosDbChangeFeedService;

        public ChangeFeedWorker(ILogger<ChangeFeedWorker> logger,
            ICosmosDbChangeFeedService cosmosDbChangeFeedService)
        {
            _logger = logger;
            _cosmosDbChangeFeedService = cosmosDbChangeFeedService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //while (!stoppingToken.IsCancellationRequested)
            //{
            //    _logger.LogInformation("ChangeFeedWorker running at: {time}", DateTimeOffset.Now);
            //    await Task.Delay(1000, stoppingToken);
            //}
            _logger.LogInformation("{time}: Starting the ChangeFeedWorker", DateTimeOffset.Now);
            await _cosmosDbChangeFeedService.StartChangeFeedProcessorsAsync();
        }
    }
}