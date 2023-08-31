using System.Text;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Events;
using CoreClaims.Infrastructure.Helpers;
using CoreClaims.Infrastructure.Repository;

namespace CoreClaims.WorkerService
{
    public class EventHubWorkerIncomingClaims : BackgroundService
    {
        private readonly ILogger<EventHubWorkerIncomingClaims> _logger;
        private readonly IEventHubService _eventHub;
        private readonly IClaimRepository _claimRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly IPayerRepository _payerRepository;

        public EventHubWorkerIncomingClaims(ILogger<EventHubWorkerIncomingClaims> logger,
            IEventHubService eventHub,
            IClaimRepository claimRepository,
            IProviderRepository providerRepository,
            IPayerRepository payerRepository)
        {
            _logger = logger;
            _eventHub = eventHub;
            _claimRepository = claimRepository;
            _providerRepository = providerRepository;
            _payerRepository = payerRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("{time}: Starting the EventHubWorkerIncomingClaims", DateTimeOffset.Now);
            await foreach (var partitionEvent in _eventHub.ReadEvents(Constants.EventHubTopics.Incoming, stoppingToken))
            {
                var messageBody = Encoding.UTF8.GetString(partitionEvent.Data.EventBody.ToArray());
                await ProcessIncomingClaim(messageBody);
            }
        }

        protected async Task ProcessIncomingClaim(string messageBody)
        {
            using var logScope = _logger.BeginScope("EventHubTrigger: CreateClaim");

            try
            {
                var detail = JsonSerializationHelper.DeserializeItem<ClaimDetail>(messageBody);
                _logger.LogInformation($"Processing Create Claim/{detail.ClaimId}");
                var existingClaim = await _claimRepository.GetClaim(detail.ClaimId);

                var provider = string.IsNullOrEmpty(detail.ProviderId) ? null : await _providerRepository.GetProvider(detail.ProviderId);
                var payer = string.IsNullOrEmpty(detail.PayerId) ? null : await _payerRepository.GetPayer(detail.PayerId);

                if (existingClaim != null)
                {
                    if (detail.ClaimStatus != ClaimStatus.Resubmitted)
                    {
                        await _eventHub.TriggerEventAsync(detail, Constants.EventHubTopics.Rejected);
                        _logger.LogInformation($"Rejecting duplicate create Claim/{detail.ClaimId}");
                        return;
                    }

                    detail.AdjudicatorId = existingClaim.AdjudicatorId;
                    detail.CreatedBy = existingClaim.CreatedBy;
                    detail.CreatedOn = existingClaim.CreatedOn;
                    detail.ModifiedBy = "EventTrigger/CreateClaim/Update";
                    //detail.ModifiedOn = DateTime.UtcNow.ToString();
                    detail.ModifiedOn = DateTime.UtcNow;
                    detail.PayerName = payer?.Name;
                    detail.ProviderName = provider?.Name;
                    detail.Comment = "Claim updated from Upstream";
                    detail.TotalAmount = detail.LineItems.Sum(i => i.Amount - i.Discount);

                    await _claimRepository.UpdateClaim(detail);
                }
                else
                {
                    if (detail.ClaimStatus == ClaimStatus.Resubmitted)
                    {
                        await _eventHub.TriggerEventAsync(detail, Constants.EventHubTopics.Rejected);
                        _logger.LogInformation($"Rejecting non-existent update Claim/{detail.ClaimId}");
                        return;
                    }

                    detail.PayerName = payer?.Name;
                    detail.ProviderName = provider?.Name;
                    detail.ClaimStatus = ClaimStatus.Initial;
                    detail.CreatedBy = detail.ModifiedBy = "EventTrigger/ClaimCreation";
                    detail.Comment = "Claim created Upstream";
                    detail.TotalAmount = detail.LineItems.Sum(i => i.Amount - i.Discount);

                    detail.CreatedOn ??= detail.FilingDate;
                    detail.ModifiedOn ??= detail.FilingDate;

                    await _claimRepository.CreateClaim(detail);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to handle Create Claim event");
                throw;
            }
        }
    }
}