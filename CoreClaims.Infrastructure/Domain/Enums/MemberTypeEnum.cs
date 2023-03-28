using Newtonsoft.Json;

namespace CoreClaims.Infrastruture.Domains.Enums
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
