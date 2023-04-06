using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Enums
{
    public enum MemberTypeEnum
    {
        [JsonProperty("Self")]
        Self,
        [JsonProperty("Spouse")]
        Spouse,
        [JsonProperty("Dependent")]
        Dependent
    }
}
