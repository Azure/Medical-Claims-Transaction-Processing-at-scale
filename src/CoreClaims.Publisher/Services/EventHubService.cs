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
        private readonly string _connectionString;

        public EventHubService(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected EventHubProducerClient GetClient(string hubName)
        {
            return new EventHubProducerClient(_connectionString, hubName);
        }

        public async Task SendDataAsync<T>(string hubName, IEnumerable<T> data)
        {
            await using var client = GetClient(hubName);

            var events = data.Select(i => new EventData(JsonSerializationHelper.SerializeItem(i)));
            
            await client.SendAsync(events);
        }
    }
}
