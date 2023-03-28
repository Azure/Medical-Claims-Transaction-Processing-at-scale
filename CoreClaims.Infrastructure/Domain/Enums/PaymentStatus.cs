using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Enums
{
    public enum PaymentStatus
    {
        [JsonProperty("Pending")]
        Pending = 0,
        [JsonProperty("Complete")]
        Complete = 1
    }
}
