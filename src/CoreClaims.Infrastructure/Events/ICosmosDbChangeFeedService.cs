namespace CoreClaims.Infrastructure.Events;

public interface ICosmosDbChangeFeedService
{
    bool IsInitialized { get; }
    Task StartChangeFeedProcessorsAsync();
    Task StopChangeFeedProcessorAsync();
}