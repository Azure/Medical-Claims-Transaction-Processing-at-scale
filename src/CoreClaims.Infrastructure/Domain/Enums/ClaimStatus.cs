using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Enums
{
    public enum ClaimStatus
    {
        [JsonProperty("Initial")]
        Initial = 0,

        [JsonProperty("Assigned")]
        Assigned = 1,

        [JsonProperty("Acknowledged")]
        Acknowledged = 2,

        [JsonProperty("Approved")]
        Approved = 3,

        [JsonProperty("Proposed")]
        Proposed = 4,

        [JsonProperty("Denied")]
        Denied = 5,

        [JsonProperty("ApprovalRequired")]
        ApprovalRequired = 6,

        [JsonProperty("Resubmitted")]
        Resubmitted = 8,

        [JsonProperty("Pending")]
        Pending = 9
    }
}
