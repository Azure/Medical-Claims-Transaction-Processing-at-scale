using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Functions.Worker;

namespace CoreClaims.FunctionApp.Models.Output
{
    public class ClaimApprovedOutput : OutputBase
    {
        [EventHubOutput(Constants.EventHubTopics.Approved,
                Connection = Constants.Connections.EventHub)]
        public ClaimDetail Claim { get; set; }
    }
}
