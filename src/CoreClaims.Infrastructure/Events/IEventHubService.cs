namespace CoreClaims.Infrastructure.Events
{
    public interface IEventHubService
    {
        Task TriggerEventAsync<T>(T eventPayload, string eventHubName);
    }
}
