using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Messaging.EventHubs;
using CoreClaims.Infrastructure;
using Microsoft.Extensions.Logging;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.Infrastructure.Helpers;
using Microsoft.Azure.Functions.Worker;
using Azure.Messaging.EventHubs.Producer;
using CoreClaims.Infrastructure.Events;
using CoreClaims.FunctionApp.HttpTriggers.Claims;

namespace CoreClaims.FunctionApp.EventHubTriggers
{
    public class CreateClaim
    {
        private readonly IClaimRepository _claimRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly IPayerRepository _payerRepository;
        private readonly IEventHubService _eventHub;

        public CreateClaim(
            IClaimRepository claimRepository, 
            IProviderRepository providerRepository, 
            IPayerRepository payerRepository,
            IEventHubService eventHub)
        {
            _claimRepository = claimRepository;
            _providerRepository = providerRepository;
            _payerRepository = payerRepository;
            _eventHub = eventHub;
        }

        [Function("CreateClaim")]
        public async Task Run(
            [EventHubTrigger(Constants.EventHubTopics.Incoming,
                Connection = Constants.Connections.EventHub,
                IsBatched = false)]
            string messageBody,
            FunctionContext context)
        {
            var logger = context.GetLogger<CreateClaim>();
            using var logScope = logger.BeginScope("EventHubTrigger: CreateClaim");

            try
            {
                //var messageBody = Encoding.UTF8.GetString(incoming.EventBody.ToArray());
                var detail = JsonSerializationHelper.DeserializeItem<ClaimDetail>(messageBody);

                var existingClaim = await _claimRepository.GetClaim(detail.ClaimId);

                var provider = string.IsNullOrEmpty(detail.ProviderId) ? null : await _providerRepository.GetProvider(detail.ProviderId);
                var payer = string.IsNullOrEmpty(detail.PayerId) ? null : await _payerRepository.GetPayer(detail.PayerId);

                if (existingClaim != null)
                {
                    if (detail.ClaimStatus != ClaimStatus.Resubmitted)
                    {
                        await _eventHub.TriggerEventAsync(detail, Constants.EventHubTopics.Rejected);
                        logger.LogInformation($"Rejecting duplicate create Claim/{detail.ClaimId}");
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
                        logger.LogInformation($"Rejecting non-existent update Claim/{detail.ClaimId}");
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
                logger.LogError(ex, "Failed to handle Create Claim event");
                throw;
            }
        }
    }
}
