using Azure.Messaging.EventHubs.Consumer;

namespace CoreClaims.Infrastructure.Events
{
    public interface IEventHubService
    {
        Task TriggerEventAsync<T>(T eventPayload, string eventHubName);
        IAsyncEnumerable<PartitionEvent> ReadEvents(string eventHubName, CancellationToken cancellationToken);
    }
}
