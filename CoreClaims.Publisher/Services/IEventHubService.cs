using System.Collections.Generic;
using System.Threading.Tasks;

namespace CoreClaims.Publisher.Services
{
    public interface IEventHubService
    {
        Task SendDataAsync<T>(string hubName, IEnumerable<T> data);
    }
}