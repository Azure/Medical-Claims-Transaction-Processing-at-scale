namespace CoreClaims.Infrastructure
{
    public static class Constants
    {
        public const int DefaultPageSize = 50;

        public static class EventHubTopics
        {
            public const string Rejected = "RejectedClaim";
            public const string Incoming = "IncomingClaim";
            public const string Denied = "ClaimDenied";
            public const string Approved = "ClaimApproved";
        }

        public static class Connections
        {
            public const string EventHub = "CoreClaimsEventHub";
            public const string EventHubNamespace = $"{EventHub}:fullyQualifiedNamespace";
            public const string CosmosDb = "CoreClaimsCosmosDB";
            public const string CosmosDbEndpoint = $"{CosmosDb}:accountEndpoint";
            public const string CosmosDbName = "CoreClaimsApp";
        }
    }
}
