using System.Text;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Helpers;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.WorkerService
{
    public class EventHubWorkerAdjudicatorChanged : BackgroundService
    {
        private readonly ILogger<EventHubWorkerAdjudicatorChanged> _logger;
        private readonly IEventHubService _eventHub;
        private readonly IAdjudicatorRepository _adjudicatorRepository;

        public EventHubWorkerAdjudicatorChanged(ILogger<EventHubWorkerAdjudicatorChanged> logger,
            IEventHubService eventHub,
            IAdjudicatorRepository adjudicatorRepository)
        {
            _logger = logger;
            _eventHub = eventHub;
            _adjudicatorRepository = adjudicatorRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("{time}: Starting the EventHubWorkerAdjudicatorChanged", DateTimeOffset.Now);
            await foreach (var partitionEvent in _eventHub.ReadEvents(Constants.EventHubTopics.AdjudicatorChanged, stoppingToken))
            {
                var messageBody = Encoding.UTF8.GetString(partitionEvent.Data.EventBody.ToArray());
                await ProcessAdjudictorChanged(messageBody);
            }
        }
        
        protected async Task ProcessAdjudictorChanged(string messageBody)
        {
            using var logScope = _logger.BeginScope("EventHubTrigger: AdjudicatorChanged");

            try
            {
                var proposedClaimHeader = JsonSerializationHelper.DeserializeItem<ClaimHeader>(messageBody);
                _logger.LogInformation($"Processing Adjudicator Changed Claim/{proposedClaimHeader.ClaimId}");
                var existingAdjudicatorClaim =
                    await _adjudicatorRepository.GetAdjudicatorClaim(proposedClaimHeader.AdjudicatorId,
                        proposedClaimHeader.Id);

                if (existingAdjudicatorClaim != null)
                {
                    _logger.LogInformation("Deleting the previous adjudicatorClaim.");
                    await _adjudicatorRepository.DeleteAdjudicatorClaim(existingAdjudicatorClaim.AdjudicatorId,
                        existingAdjudicatorClaim.Id);
                }
                else
                {
                    _logger.LogInformation("No previous adjudicatorClaim found. Exiting.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to handle Adjudicator Changed event");
                throw;
            }
        }
    }
}