using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Consumer;
using Azure.Messaging.EventHubs.Producer;
using System.Text;
using System.Text.Json;

namespace CoreClaims.Infrastructure.Events
{
    public class EventHubService : IEventHubService
    {
        readonly Dictionary<string, EventHubProducerClient> _producerClients = new Dictionary<string, EventHubProducerClient>();
        Dictionary<string, EventHubConsumerClient> _consumerClients = new Dictionary<string, EventHubConsumerClient>();

        readonly string _namespace;

        public EventHubService(string qualifiedNamespace)
        {
            if (string.IsNullOrWhiteSpace(qualifiedNamespace)) 
                throw new ArgumentNullException(nameof(qualifiedNamespace));

            _namespace = qualifiedNamespace;
        }

        public async Task TriggerEventAsync<T>(T eventPayload, string eventHubName)
        {
            if (string.IsNullOrWhiteSpace(eventHubName))
                throw new ArgumentNullException(nameof(eventHubName));

            var client = GetProducerClient(eventHubName);
            await client.SendAsync(new EventData[] { new EventData(JsonSerializer.Serialize(eventPayload)) });
        }

        public IAsyncEnumerable<PartitionEvent> ReadEvents(string eventHubName, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(eventHubName))
                throw new ArgumentNullException(nameof(eventHubName));

            var client = GetConsumerClient(eventHubName);
            return client.ReadEventsAsync(cancellationToken);
        }

        private EventHubProducerClient GetProducerClient(string eventHubName)
        {
            if (_producerClients.ContainsKey(eventHubName))
                return _producerClients[eventHubName];

            var newClient = new EventHubProducerClient(_namespace, eventHubName, new Azure.Identity.DefaultAzureCredential());
            _producerClients.Add(eventHubName, newClient);
            return newClient;
        }

        private EventHubConsumerClient GetConsumerClient(string eventHubName)
        {
            if (_consumerClients.ContainsKey(eventHubName))
                return _consumerClients[eventHubName];

            var newClient = new EventHubConsumerClient(EventHubConsumerClient.DefaultConsumerGroupName, _namespace, eventHubName, new Azure.Identity.DefaultAzureCredential());
            _consumerClients.Add(eventHubName, newClient);
            return newClient;
        }
    }
}
