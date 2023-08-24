using CoreClaims.Infrastructure.Events;

namespace ClaimsWorkerService
{
    public class EventHubWorker : BackgroundService
    {
        private readonly ILogger<EventHubWorker> _logger;
        //private readonly ICosmosDbChangeFeedService _cosmosDbChangeFeedService;

        public EventHubWorker(ILogger<EventHubWorker> logger)//, ICosmosDbChangeFeedService cosmosDbChangeFeedService)
        {
            _logger = logger;
            //_cosmosDbChangeFeedService = cosmosDbChangeFeedService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("EventHubWorker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}