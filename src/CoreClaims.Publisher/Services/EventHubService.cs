using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;
using CoreClaims.Infrastructure.Helpers;

namespace CoreClaims.Publisher.Services
{
    public class EventHubService
    {
        private readonly string _fullyQualifiedNamespace;

        public EventHubService(string fullyQualifiedNamespace)
        {
            _fullyQualifiedNamespace = fullyQualifiedNamespace;
        }

        protected EventHubProducerClient GetClient(string hubName)
        {
            return new EventHubProducerClient(_fullyQualifiedNamespace, hubName, new DefaultAzureCredential());
        }

        public async Task SendDataAsync<T>(string hubName, IEnumerable<T> data)
        {
            await using var client = GetClient(hubName);

            var events = data.Select(i => new EventData(JsonSerializationHelper.SerializeItem(i)));
            
            await client.SendAsync(events);
        }
    }
}
