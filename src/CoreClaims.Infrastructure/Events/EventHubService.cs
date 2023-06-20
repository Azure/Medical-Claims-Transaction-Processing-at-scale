using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;
using System.Text;
using System.Text.Json;

namespace CoreClaims.Infrastructure.Events
{
    public class EventHubService : IEventHubService
    {
        Dictionary<string, EventHubProducerClient> _clients = new Dictionary<string, EventHubProducerClient>();

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

            var client = GetClient(eventHubName);
            await client.SendAsync(new EventData[] { new EventData(JsonSerializer.Serialize(eventPayload)) });
        }

        private EventHubProducerClient GetClient(string eventHubName)
        {
            if (_clients.ContainsKey(eventHubName))
                return _clients[eventHubName];

            var newClient = new EventHubProducerClient(_namespace, eventHubName, new Azure.Identity.DefaultAzureCredential());
            _clients.Add(eventHubName, newClient);
            return newClient;
        }
    }
}
